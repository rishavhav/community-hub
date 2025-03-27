import React, { useEffect, useState, useRef } from "react"
import { useNavigate } from "react-router-dom"
import { jwtDecode } from "jwt-decode"

function EventCarousel({ title, events, isAdmin, onDelete }) {
  const ref = useRef()

  const scroll = (direction) => {
    if (ref.current) {
      ref.current.scrollBy({ left: direction === "left" ? -300 : 300, behavior: "smooth" })
    }
  }

  return (
    <div className="mb-16">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-bold">{title}</h2>
        <div className="space-x-2">
          <button onClick={() => scroll("left")} className="px-2 py-1 bg-gray-700 rounded">
            ←
          </button>
          <button onClick={() => scroll("right")} className="px-2 py-1 bg-gray-700 rounded">
            →
          </button>
        </div>
      </div>

      <div ref={ref} className="flex overflow-x-auto space-x-4 pb-2 scrollbar-hide">
        {events.map((event, index) => (
          <div key={index} className="min-w-[280px] bg-neutral-800 rounded-lg overflow-hidden flex-shrink-0 shadow-md">
            <img src={event.image} alt={event.name} className="w-full h-40 object-cover" />
            <div className="p-4">
              <h3 className="text-lg font-semibold">{event.name}</h3>
              <p className="text-gray-400">{event.date}</p>
              <p className="text-gray-400">{event.time}</p>
              <a href={event.zoomLink} target="_blank" rel="noopener noreferrer">
                <button className="mt-3 px-4 py-2 bg-blue-600 rounded hover:bg-blue-700 w-full">{title.includes("Past") ? "View Recording" : "Join Zoom"}</button>
              </a>
              {isAdmin && (
                <button onClick={() => onDelete(event._id)} className="mt-2 w-full bg-red-600 hover:bg-red-700 rounded py-1 text-sm">
                  Delete Event
                </button>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

function Home() {
  const API = import.meta.env.VITE_API_BASE_URL

  const [futureEvents, setFutureEvents] = useState([])
  const [pastEvents, setPastEvents] = useState([])
  const [showForm, setShowForm] = useState(false)
  const [formData, setFormData] = useState({
    name: "",
    date: "",
    time: "",
    image: "",
    zoomLink: "",
    type: "future",
  })

  const token = localStorage.getItem("token")
  const navigate = useNavigate()
  let isAdmin = false

  if (token) {
    try {
      const decoded = jwtDecode(token)
      isAdmin = decoded.email === import.meta.env.VITE_ADMIN_EMAIL
    } catch {
      console.error("Invalid token")
    }
  }

  const fetchEvents = async () => {
    const res = await fetch(`${API}/api/events`)
    const data = await res.json()
    setFutureEvents(data.filter((e) => e.type === "future"))
    setPastEvents(data.filter((e) => e.type === "past"))
  }

  useEffect(() => {
    fetchEvents()
  }, [])

  const handleAddEvent = async (e) => {
    e.preventDefault()
    if (!token) return alert("Unauthorized")

    const res = await fetch(`${API}/api/events/add`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(formData),
    })

    if (res.ok) {
      setShowForm(false)
      setFormData({ name: "", date: "", time: "", image: "", zoomLink: "", type: "future" })
      fetchEvents()
    } else {
      alert("Failed to add event")
    }
  }

  const handleDeleteEvent = async (id) => {
    if (!token) return alert("Unauthorized")

    const res = await fetch(`${API}/api/events/delete/${id}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })

    if (res.ok) {
      fetchEvents()
    } else {
      alert("Failed to delete event")
    }
  }

  return (
    <div className="bg-neutral-900 text-white min-h-screen px-6 md:px-20 py-12">
      {isAdmin && (
        <div className="flex justify-between mb-8">
          <h1 className="text-3xl font-bold">Events</h1>
          <button onClick={() => setShowForm(!showForm)} className="bg-yellow-500 px-4 py-2 rounded text-black font-semibold">
            {showForm ? "Close Form" : "Add Event (Admin)"}
          </button>
        </div>
      )}

      {showForm && (
        <form onSubmit={handleAddEvent} className="bg-neutral-800 p-6 rounded mb-10 space-y-4">
          <input type="text" placeholder="Event Name" required className="w-full p-2 bg-neutral-700 rounded" value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} />
          <input type="text" placeholder="Date" required className="w-full p-2 bg-neutral-700 rounded" value={formData.date} onChange={(e) => setFormData({ ...formData, date: e.target.value })} />
          <input type="text" placeholder="Time" required className="w-full p-2 bg-neutral-700 rounded" value={formData.time} onChange={(e) => setFormData({ ...formData, time: e.target.value })} />
          <input type="text" placeholder="Image URL" required className="w-full p-2 bg-neutral-700 rounded" value={formData.image} onChange={(e) => setFormData({ ...formData, image: e.target.value })} />
          <input type="text" placeholder="Zoom Link" required className="w-full p-2 bg-neutral-700 rounded" value={formData.zoomLink} onChange={(e) => setFormData({ ...formData, zoomLink: e.target.value })} />
          <select className="w-full p-2 bg-neutral-700 rounded" value={formData.type} onChange={(e) => setFormData({ ...formData, type: e.target.value })}>
            <option value="future">Upcoming</option>
            <option value="past">Past</option>
          </select>
          <button type="submit" className="bg-blue-600 px-4 py-2 rounded w-full">
            Submit
          </button>
        </form>
      )}

      <EventCarousel title="🟢 Upcoming Events" events={futureEvents} isAdmin={isAdmin} onDelete={handleDeleteEvent} />
      <EventCarousel title="🕘 Past Events" events={pastEvents} isAdmin={isAdmin} onDelete={handleDeleteEvent} />
    </div>
  )
}

export default Home
