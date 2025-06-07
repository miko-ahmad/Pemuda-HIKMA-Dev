'use client';
import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { useSession } from 'next-auth/react';
import dynamic from 'next/dynamic';
import 'react-quill/dist/quill.snow.css';

const ReactQuill = dynamic(() => import('react-quill'), { ssr: false });

export default function EditEventPage() {
  const router = useRouter();
  const params = useParams();
  const slugParam = params.slug;
  const { data: session, status } = useSession();

  const [formData, setFormData] = useState({
    title: '',
    slug: '',
    description: '',
    date: '',
    location: '',
    price: '',
    image: '',
  });

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [manualSlugEdit, setManualSlugEdit] = useState(false);

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/login');
    }
  }, [status]);

  useEffect(() => {
    const fetchEvent = async () => {
      try {
        const res = await fetch(`/api/events?slug=${slugParam}`);
        if (!res.ok) throw new Error('Gagal mengambil data event');
        const data = await res.json();
        setFormData({
          title: data.title,
          slug: data.slug,
          description: data.description,
          date: data.date.slice(0, 16),
          location: data.location,
          price: data.price,
          image: data.image || '',
        });
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    if (slugParam) fetchEvent();
  }, [slugParam]);

  useEffect(() => {
    if (!manualSlugEdit) {
      const newSlug = formData.title
        .toLowerCase()
        .trim()
        .replace(/\s+/g, '-')
        .replace(/[^a-z0-9\-]/g, '');
      setFormData(prev => ({ ...prev, slug: newSlug }));
    }
  }, [formData.title, manualSlugEdit]);

  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name === 'slug') {
      setManualSlugEdit(true);
    }

    setFormData(prev => ({
      ...prev,
      [name]: name === 'price' ? parseFloat(value) : value,
    }));
  };

  const handleDescriptionChange = (value) => {
    setFormData(prev => ({ ...prev, description: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setIsSubmitting(true);

    try {
      const res = await fetch(`/api/events?slug=${slugParam}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.message || 'Gagal menyimpan perubahan');
      }

      router.push('/events-admin');
    } catch (err) {
      setError(err.message || 'Terjadi kesalahan');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading || status === 'loading') {
    return <p className="text-center py-10">Memuat...</p>;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Edit Event</h1>

      {error && (
        <div className="mb-4 p-4 bg-red-100 text-red-700 rounded">{error}</div>
      )}

      <form onSubmit={handleSubmit} className="max-w-3xl space-y-6">
        <div>
          <label className="block font-medium mb-1">Judul Event</label>
          <input
            type="text"
            name="title"
            value={formData.title}
            onChange={handleChange}
            required
            className="w-full border rounded p-3"
          />
        </div>

        <div>
          <label className="block font-medium mb-1">Slug</label>
          <input
            type="text"
            name="slug"
            value={formData.slug}
            onChange={handleChange}
            required
            className="w-full border rounded p-3"
          />
        </div>

        <div>
          <label className="block font-medium mb-1">Deskripsi</label>
          <ReactQuill
            value={formData.description}
            onChange={handleDescriptionChange}
            theme="snow"
            className="bg-white"
          />
        </div>

        <div>
          <label className="block font-medium mb-1">Tanggal & Waktu</label>
          <input
            type="datetime-local"
            name="date"
            value={formData.date}
            onChange={handleChange}
            required
            className="w-full border rounded p-3"
          />
        </div>

        <div>
          <label className="block font-medium mb-1">Lokasi</label>
          <input
            type="text"
            name="location"
            value={formData.location}
            onChange={handleChange}
            required
            className="w-full border rounded p-3"
          />
        </div>

        <div>
          <label className="block font-medium mb-1">Harga (Rp)</label>
          <input
            type="number"
            name="price"
            value={formData.price}
            onChange={handleChange}
            required
            className="w-full border rounded p-3"
          />
        </div>

        <div>
          <label className="block font-medium mb-1">URL Gambar (Opsional)</label>
          <input
            type="text"
            name="image"
            value={formData.image}
            onChange={handleChange}
            placeholder="https://..."
            className="w-full border rounded p-3"
          />
        </div>

        <div className="flex gap-4">
          <button
            type="submit"
            disabled={isSubmitting}
            className="bg-blue-600 text-white px-6 py-3 rounded hover:bg-blue-700 disabled:opacity-50"
          >
            {isSubmitting ? 'Menyimpan...' : 'Simpan'}
          </button>
          <button
            type="button"
            onClick={() => router.push('/events-admin')}
            className="bg-gray-300 px-6 py-3 rounded hover:bg-gray-400"
          >
            Batal
          </button>
        </div>
      </form>
    </div>
  );
}
