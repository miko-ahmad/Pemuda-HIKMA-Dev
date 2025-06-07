"use client";
import { useState } from "react";
import Link from "next/link";
import DeleteConfirmationModal from "@/components/DeleteConfirmationModal";
import { FormattedDate } from '@/components/FormattedDate';

export default function EventTable({ events }) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [eventToDelete, setEventToDelete] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDeleteClick = (event) => {
    setEventToDelete(event);
    setIsModalOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (!eventToDelete) return;

    setIsDeleting(true);
    try {
      const response = await fetch(
        `/api/events?slug=${eventToDelete.slug}`,
        {
          method: "DELETE",
        }
      );

      if (response.ok) {
        window.location.reload();
      } else {
        alert("Failed to delete event");
      }
    } catch (error) {
      console.error("Delete error:", error);
      alert("Error deleting event");
    } finally {
      setIsDeleting(false);
      setIsModalOpen(false);
    }
  };

  return (
    <div>
      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Title
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Price
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Location
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Date
              </th>
              
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {events.map((event) => (
              <tr key={event.id}>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="font-medium text-gray-900">{event.title}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-gray-500">{event.price || '-'}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-gray-500">{event.location || '-'}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  <FormattedDate date={event.date} />
                </td>
                
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                  <Link
                    href={`/events-admin/${event.slug}/details`}
                    className="text-blue-600 hover:text-blue-900 mr-3"
                  >
                    View
                  </Link>
                  <button
                    onClick={() => handleDeleteClick(event)}
                    className="text-red-600 hover:text-red-900 mr-3"
                  >
                    Delete
                  </button>
                  <Link
                    href={`/events-admin/${event.slug}/edit`}
                    className="text-blue-600 hover:text-blue-900"
                  >
                    Edit
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <DeleteConfirmationModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onConfirm={handleConfirmDelete}
        itemName="event"
        isLoading={isDeleting}
      />
    </div>
  );
}
