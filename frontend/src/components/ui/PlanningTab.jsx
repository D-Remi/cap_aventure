import { useState, useEffect } from 'react'
import axios from 'axios'
import { useAuth } from '../../context/AuthContext'
import WeekCalendar from './WeekCalendar'

export default function PlanningTab() {
  const { user } = useAuth()
  const [slots,    setSlots]    = useState([])
  const [children, setChildren] = useState([])
  const [bookings, setBookings] = useState([])
  const [indispos, setIndispos] = useState([])
  const [loading,  setLoading]  = useState(true)

  const fetchAll = () => Promise.all([
    axios.get('/api/slots?all=true'),
    axios.get('/api/children'),
    axios.get('/api/bookings/mine'),
  ]).then(([s,c,b]) => { setSlots(s.data); setChildren(c.data); setBookings(b.data) })
    .finally(() => setLoading(false))

  useEffect(() => { fetchAll() }, [])

  const mySlotIds = new Set(bookings.filter(b => b.status !== 'cancelled').map(b => b.slot_id))
  const enriched  = slots.map(s => ({
    ...s,
    _reserved: mySlotIds.has(s.id),
  }))

  if (loading) return <div style={{color:'var(--text-muted)',padding:'2rem',textAlign:'center'}}>Chargement...</div>

  return (
    <WeekCalendar
      slots={enriched}
      children={children}
      isLoggedIn={true}
      onBooked={fetchAll}
      showEmpty={true}
      mode="parent"
      indisponibilites={indispos}
    />
  )
}