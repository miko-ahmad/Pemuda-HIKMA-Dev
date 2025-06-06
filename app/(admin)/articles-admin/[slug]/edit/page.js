// app/(admin)/articles-admin/[slug]/edit/page.js
'use client';
import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { useSession } from 'next-auth/react';
import dynamic from 'next/dynamic';

// Load editor secara dinamis (client-side only)
const ReactQuill = dynamic(() => import('react-quill'), {
  ssr: false,
  loading: () => <p>Memuat editor...</p>
});

import 'react-quill/dist/quill.snow.css';

export default function EditArticlePage() {
  const router = useRouter();
  const params = useParams();
  const slugParam = params.slug;
  const { data: session, status } = useSession();

  const [formData, setFormData] = useState({
    title: '',
    slug: '',
    content: '',
    published: false,
    existingImageUrl: ''
  });
  const [imageFile, setImageFile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [manualSlugEdit, setManualSlugEdit] = useState(false);

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

  // Redirect jika belum login
  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/login');
    }
  }, [status, router]);

  // Ambil data artikel
  useEffect(() => {
    if (!slugParam) return;
    const fetchArticle = async () => {
      try {
        const res = await fetch(`/api/articles?slug=${slugParam}`);
        if (!res.ok) throw new Error('Gagal mengambil data artikel');
        const data = await res.json();
        setFormData({
          title: data.title,
          slug: data.slug,
          content: data.content,
          published: data.published,
          existingImageUrl: data.image || ''
        });
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchArticle();
  }, [slugParam]);

  // Generate slug otomatis
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
    const { name, value, type, checked, files } = e.target;

    if (name === 'slug') {
      setManualSlugEdit(true);
      setFormData(prev => ({ ...prev, slug: value }));
      return;
    }

    if (name === 'image') {
      setImageFile(files[0] || null);
      return;
    }

    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleContentChange = (value) => {
    setFormData(prev => ({ ...prev, content: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setIsSubmitting(true);

    try {
      let imageUrl = formData.existingImageUrl;

      if (imageFile) {
        const uploadFormData = new FormData();
        uploadFormData.append('file', imageFile);

        const uploadRes = await fetch('/api/upload-image', {
          method: 'POST',
          body: uploadFormData,
        });

        if (!uploadRes.ok) {
          const errorData = await uploadRes.json();
          throw new Error(errorData.error || 'Gagal mengunggah gambar');
        }

        const uploadData = await uploadRes.json();
        imageUrl = uploadData.url;
      }

      const response = await fetch(`/api/articles?slug=${slugParam}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: formData.title,
          slug: formData.slug,
          content: formData.content,
          image: imageUrl,
          published: formData.published,
        }),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.message || 'Gagal memperbarui artikel');
      }

      router.push('/articles-admin');
    } catch (err) {
      setError(err.message || 'Terjadi kesalahan. Silakan coba lagi.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (status === 'loading' || loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <p>Memuat...</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Edit Artikel</h1>

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
            />
            <p className="text-sm text-gray-500 mt-1">
              Alamat unik untuk artikel ini
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
              className="bg-white rounded-lg"
              placeholder="Tulis konten artikel disini..."
            />
          </div>

          <div>
            <label className="block mb-2 font-medium">
              Gambar Utama
            </label>
            {formData.existingImageUrl && (
              <div className="mb-4">
                <img
                  src={formData.existingImageUrl}
                  alt="Gambar saat ini"
                  className="max-w-xs max-h-40 object-contain border rounded"
                />
                <p className="text-sm text-gray-500 mt-1">Gambar saat ini</p>
              </div>
            )}
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
              Publikasikan Artikel
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
            {isSubmitting ? 'Menyimpan...' : 'Simpan Perubahan'}
          </button>

          <button
            type="button"
            onClick={() => router.push('/admin/articles')}
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