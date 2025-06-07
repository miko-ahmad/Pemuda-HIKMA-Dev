'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import dynamic from 'next/dynamic';

const ReactQuill = dynamic(() => import('react-quill'), { ssr: false });
import 'react-quill/dist/quill.snow.css';

export default function NewEventPage() {
  const [formData, setFormData] = useState({
    title: '',
    slug: '',
    description: '',
    image: null,
    date: '',
    location: '',
    price: '',
  });
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [manualSlugEdit, setManualSlugEdit] = useState(false);

  const router = useRouter();
  const { data: session, status } = useSession();

  useEffect(() => {
    if (!manualSlugEdit) {
      const slug = formData.title
        .toLowerCase()
        .replace(/\s+/g, '-')
        .replace(/[^a-z0-9\-]/g, '');
      setFormData(prev => ({ ...prev, slug }));
    }
  }, [formData.title, manualSlugEdit]);

  useEffect(() => {
    if (status === 'loading') return;
    if (!session) {
      router.push('/auth/signin');
    }
  }, [session, status, router]);

  const handleChange = (e) => {
    const { name, value, type, files } = e.target;

    if (name === 'slug') {
      setManualSlugEdit(true);
      setFormData(prev => ({ ...prev, slug: value }));
      return;
    }

    if (name === 'image') {
      setFormData(prev => ({ ...prev, image: files[0] || null }));
      return;
    }

    setFormData(prev => ({
      ...prev,
      [name]: type === 'number' ? Number(value) : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setIsSubmitting(true);

    try {
      let imageUrl = '';

      if (formData.image) {
        const uploadFormData = new FormData();
        uploadFormData.append('file', formData.image);

        const uploadRes = await fetch('/api/upload-image', {
          method: 'POST',
          body: uploadFormData,
        });

        if (!uploadRes.ok) {
          const errorData = await uploadRes.json();
          throw new Error(errorData.error || 'Gagal upload gambar');
        }

        const uploadData = await uploadRes.json();
        imageUrl = uploadData.url;
      }

      if (!formData.title || !formData.slug || !formData.description || !formData.date || !formData.location || formData.price === '') {
        throw new Error('Harap lengkapi semua field');
      }

      const eventData = {
        title: formData.title,
        slug: formData.slug,
        description: formData.description,
        image: imageUrl || null,
        date: formData.date,
        location: formData.location,
        price: Number(formData.price),
      };

      const response = await fetch('/api/events', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(eventData),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.message || 'Gagal membuat event');
      }

      router.push('/events-admin');
      router.refresh();
    } catch (err) {
      console.error('Error:', err);
      setError(err.message || 'Terjadi kesalahan. Silakan coba lagi.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDescriptionChange = (value) => {
    setFormData(prev => ({ ...prev, description: value }));
  };

  if (status === 'loading' || !session) {
    return (
      <div className="flex justify-center items-center h-screen">
        <p>Memuat...</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Buat Event Baru</h1>

      {error && (
        <div className="mb-6 p-4 bg-red-100 text-red-700 rounded-md">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="max-w-4xl mx-auto">
        <div className="grid gap-6 mb-6">

          <div>
            <label htmlFor="title" className="block mb-2 font-medium">Judul Event</label>
            <input
              id="title"
              name="title"
              type="text"
              className="w-full p-3 border rounded-lg"
              value={formData.title}
              onChange={handleChange}
              required
              disabled={isSubmitting}
              placeholder="Masukkan judul event"
            />
          </div>

          <div>
            <label htmlFor="slug" className="block mb-2 font-medium">URL Slug</label>
            <input
              id="slug"
              name="slug"
              type="text"
              className="w-full p-3 border rounded-lg"
              value={formData.slug}
              onChange={handleChange}
              required
              disabled={isSubmitting}
              placeholder="url-slug-event"
            />
            <p className="text-sm text-gray-500 mt-1">Alamat unik untuk event ini (otomatis terisi dari judul)</p>
          </div>

          <div>
            <label className="block mb-2 font-medium">Deskripsi Event</label>
            <ReactQuill
              theme="snow"
              value={formData.description}
              onChange={handleDescriptionChange}
              className="bg-white"
              readOnly={isSubmitting}
            />
          </div>

          <div>
            <label htmlFor="image" className="block mb-2 font-medium">Gambar Utama</label>
            <input
              id="image"
              name="image"
              type="file"
              accept="image/*"
              onChange={handleChange}
              disabled={isSubmitting}
              className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
            />
            <p className="text-sm text-gray-500 mt-1">Ukuran maksimal 2MB. Format: JPG, PNG, atau WEBP</p>
          </div>

          <div>
            <label htmlFor="date" className="block mb-2 font-medium">Tanggal Event</label>
            <input
              id="date"
              name="date"
              type="date"
              className="w-full p-3 border rounded-lg"
              value={formData.date}
              onChange={handleChange}
              required
              disabled={isSubmitting}
            />
          </div>

          <div>
            <label htmlFor="location" className="block mb-2 font-medium">Lokasi</label>
            <input
              id="location"
              name="location"
              type="text"
              className="w-full p-3 border rounded-lg"
              value={formData.location}
              onChange={handleChange}
              required
              disabled={isSubmitting}
              placeholder="Contoh: Jakarta Convention Center"
            />
          </div>

          <div>
            <label htmlFor="price" className="block mb-2 font-medium">Harga (Rp)</label>
            <input
              id="price"
              name="price"
              type="number"
              min="0"
              step="1000"
              className="w-full p-3 border rounded-lg"
              value={formData.price}
              onChange={handleChange}
              required
              disabled={isSubmitting}
              placeholder="Contoh: 150000"
            />
          </div>
        </div>

        <div className="flex gap-4">
          <button
            type="submit"
            disabled={isSubmitting}
            className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isSubmitting ? 'Menyimpan...' : 'Simpan Event'}
          </button>

          <button
            type="button"
            onClick={() => router.push('/events-admin')}
            disabled={isSubmitting}
            className="px-6 py-3 bg-gray-300 rounded-lg hover:bg-gray-400"
          >
            Batal
          </button>
        </div>
      </form>
    </div>
  );
}
