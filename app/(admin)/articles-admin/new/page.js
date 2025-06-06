// app/(admin)/articles-admin/new/page.js
'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import dynamic from 'next/dynamic';

// Load editor secara dinamis (client-side only)
const ReactQuill = dynamic(() => import('react-quill'), {
  ssr: false,
  loading: () => <p>Memuat editor...</p>
});

import 'react-quill/dist/quill.snow.css';

export default function NewArticlePage() {
  const [formData, setFormData] = useState({
    title: '',
    slug: '',
    content: '',
    image: null,
    published: false,
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [manualSlugEdit, setManualSlugEdit] = useState(false);

  const router = useRouter();
  const { data: session, status } = useSession();

  // Modul untuk editor
  const modules = {
    toolbar: [
      [{ 'header': [1, 2, 3, false] }],
      ['bold', 'italic', 'underline', 'strike'],
      [{ 'list': 'ordered'}, { 'list': 'bullet' }],
      ['link', 'image'],
      ['clean']
    ],
  };

  // Format untuk editor
  const formats = [
    'header',
    'bold', 'italic', 'underline', 'strike',
    'list', 'bullet',
    'link', 'image'
  ];

  useEffect(() => {
    if (status === 'loading') return;
    
    if (!session) {
      router.push('/auth/signin');
    }
  }, [session, status, router]);

  // Generate slug otomatis dari judul
  useEffect(() => {
    if (!manualSlugEdit) {
      const slug = formData.title
        .toLowerCase()
        .replace(/\s+/g, '-')
        .replace(/[^a-z0-9\-]/g, '');
      setFormData(prev => ({ ...prev, slug }));
    }
  }, [formData.title, manualSlugEdit]);

  const handleChange = (e) => {
    const { name, value, type, checked, files } = e.target;

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
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleContentChange = (content) => {
    setFormData(prev => ({ ...prev, content }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setIsSubmitting(true);

    try {
      let imageUrl = '';

      // Upload gambar jika ada
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

      // Kirim data artikel ke API
      const articleData = {
        title: formData.title,
        slug: formData.slug,
        content: formData.content,
        image: imageUrl || null,
        published: formData.published,
        authorId: session.user.id, // Pastikan sesuai dengan schema database
      };

      const response = await fetch('/api/articles', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(articleData),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.message || 'Gagal membuat artikel');
      }

      router.push('/articles-admin');
      router.refresh();
    } catch (err) {
      console.error('Error:', err);
      setError(err.message || 'Terjadi kesalahan. Silakan coba lagi.');
    } finally {
      setIsSubmitting(false);
    }
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
      <h1 className="text-3xl font-bold mb-8">Buat Artikel Baru</h1>

      {error && (
        <div className="mb-6 p-4 bg-red-100 text-red-700 rounded-md">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="max-w-4xl mx-auto">
        <div className="grid gap-6 mb-6">
          <div>
            <label htmlFor="title" className="block mb-2 font-medium">
              Judul Artikel
            </label>
            <input
              id="title"
              name="title"
              type="text"
              className="w-full p-3 border rounded-lg"
              value={formData.title}
              onChange={handleChange}
              required
              disabled={isSubmitting}
              placeholder="Masukkan judul artikel"
            />
          </div>

          <div>
            <label htmlFor="slug" className="block mb-2 font-medium">
              URL Slug
            </label>
            <input
              id="slug"
              name="slug"
              type="text"
              className="w-full p-3 border rounded-lg"
              value={formData.slug}
              onChange={handleChange}
              required
              disabled={isSubmitting}
              placeholder="url-slug-artikel"
            />
            <p className="text-sm text-gray-500 mt-1">
              Alamat unik untuk artikel ini (otomatis terisi dari judul)
            </p>
          </div>

          <div>
            <label htmlFor="content" className="block mb-2 font-medium">
              Konten Artikel
            </label>
            <ReactQuill
              theme="snow"
              value={formData.content}
              onChange={handleContentChange}
              modules={modules}
              formats={formats}
              className="bg-white rounded-lg mb-4"
              placeholder="Tulis konten artikel disini..."
            />
          </div>

          <div>
            <label htmlFor="image" className="block mb-2 font-medium">
              Gambar Utama
            </label>
            <input
              id="image"
              name="image"
              type="file"
              accept="image/*"
              onChange={handleChange}
              disabled={isSubmitting}
              className="block w-full text-sm text-gray-500
                file:mr-4 file:py-2 file:px-4
                file:rounded-md file:border-0
                file:text-sm file:font-semibold
                file:bg-blue-50 file:text-blue-700
                hover:file:bg-blue-100"
            />
            <p className="text-sm text-gray-500 mt-1">
              Ukuran maksimal 2MB. Format: JPG, PNG, atau WEBP
            </p>
          </div>

          <div className="flex items-center">
            <input
              id="published"
              name="published"
              type="checkbox"
              className="w-4 h-4 mr-2"
              checked={formData.published}
              onChange={handleChange}
              disabled={isSubmitting}
            />
            <label htmlFor="published" className="font-medium">
              Publikasikan Sekarang
            </label>
          </div>
        </div>

        <div className="flex gap-4">
          <button
            type="submit"
            disabled={isSubmitting}
            className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700
              disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isSubmitting ? 'Menyimpan...' : 'Simpan Artikel'}
          </button>

          <button
            type="button"
            onClick={() => router.push('/articles-admin')}
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