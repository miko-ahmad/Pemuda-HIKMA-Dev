'use client'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { uploadImage } from '@/lib/cloudinary'

export default function EditEventPage({ params }) {
  const [event, setEvent] = useState(null)
  const [title, setTitle] = useState('')
  const [slug, setSlug] = useState('')
  const [description, setDescription] = useState('')
  const [image, setImage] = useState(null)
  const [date, setDate] = useState('')
  const [location, setLocation] = useState('')
  const [price, setPrice] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const router = useRouter()

  useEffect(() => {
    const fetchEvent = async () => {
      try {
        const response = await fetch(`/api/events/${params.id}`)
        const data = await response.json()
        
        if (response.ok) {
          setEvent(data)
          setTitle(data.title)
          setSlug(data.slug)
          setDescription(data.description)
          setDate(new Date(data.date).toISOString().slice(0, 16))
          setLocation(data.location)
          setPrice(data.price.toString())
        } else {
          setError(data.message || 'Failed to fetch event')
        }
      } catch (err) {
        setError('An error occurred. Please try again.')
      }
    }

    fetchEvent()
  }, [params.id])

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    try {
      let imageUrl = event?.image || ''
      if (image) {
        imageUrl = await uploadImage(image)
      }

      const response = await fetch(`/api/events/${params.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          title,
          slug,
          description,
          image: imageUrl,
          date: new Date(date).toISOString(),
          location,
          price: parseFloat(price)
        })
      })

      if (response.ok) {
        router.push(`/admin/events/${params.id}`)
      } else {
        const data = await response.json()
        setError(data.message || 'Failed to update event')
      }
    } catch (err) {
      setError('An error occurred. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  if (!event) {
    return <div>Loading...</div>
  }

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Edit Event</h1>
      
      {error && (
        <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-md">
          {error}
        </div>
      )}
      
      <form onSubmit={handleSubmit} className="bg-white p-6 rounded-lg shadow-md">
        <div className="mb-4">
          <label className="block text-gray-700 mb-2" htmlFor="title">
            Title
          </label>
          <input
            id="title"
            type="text"
            className="w-full px-3 py-2 border rounded-md"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />
        </div>
        
        <div className="mb-4">
          <label className="block text-gray-700 mb-2" htmlFor="slug">
            Slug (URL-friendly)
          </label>
          <input
            id="slug"
            type="text"
            className="w-full px-3 py-2 border rounded-md"
            value={slug}
            onChange={(e) => setSlug(e.target.value.toLowerCase().replace(/\s+/g, '-'))}
            required
          />
        </div>
        
        <div className="mb-4">
          <label className="block text-gray-700 mb-2" htmlFor="description">
            Description
          </label>
          <textarea
            id="description"
            className="w-full px-3 py-2 border rounded-md min-h-[200px]"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            required
          />
        </div>
        
        <div className="mb-4">
          <label className="block text-gray-700 mb-2" htmlFor="image">
            Featured Image
          </label>
          {event.image && (
            <div className="mb-2">
              <img 
                src={event.image} 
                alt="Current featured" 
                className="h-32 object-cover rounded-md"
              />
            </div>
          )}
          <input
            id="image"
            type="file"
            accept="image/*"
            className="w-full px-3 py-2 border rounded-md"
            onChange={(e) => setImage(e.target.files[0])}
          />
        </div>
        
        <div className="mb-4">
          <label className="block text-gray-700 mb-2" htmlFor="date">
            Date
          </label>
          <input
            id="date"
            type="datetime-local"
            className="w-full px-3 py-2 border rounded-md"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            required
          />
        </div>
        
        <div className="mb-4">
          <label className="block text-gray-700 mb-2" htmlFor="location">
            Location
          </label>
          <input
            id="location"
            type="text"
            className="w-full px-3 py-2 border rounded-md"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            required
          />
        </div>
        
        <div className="mb-6">
          <label className="block text-gray-700 mb-2" htmlFor="price">
            Price (IDR)
          </label>
          <input
            id="price"
            type="number"
            className="w-full px-3 py-2 border rounded-md"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            required
          />
        </div>
        
        <button
          type="submit"
          className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition disabled:opacity-50"
          disabled={loading}
        >
          {loading ? 'Updating...' : 'Update Event'}
        </button>
      </form>
    </div>
  )
}