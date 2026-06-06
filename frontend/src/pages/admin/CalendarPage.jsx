import { useState, useEffect } from 'react'
import axios from 'axios'
import ContactModal from '../components/ui/ContactModal'
import { useAuth } from '../context/AuthContext'
import Navbar from '../components/layout/Navbar'
import Footer from '../components/layout/Footer'
import WeekCalendar from '../components/ui/WeekCalendar'
import './CalendarPage.css'

export default function CalendarPage() {
  const { user } = useAuth()
  const [slots,    setSlots]    = useState([])
  const [contactDate, setContactDate] = useState(null)
  const [children, setChildren] = useState([])

  useEffect(() => {
    axios.get('/api/slots?all=true').then(r => setSlots(r.data)).catch(() => {})
    if (user) axios.get('/api/children').then(r => setChildren(r.data)).catch(() => {})
  }, [user])

  return (
    <>
      <Navbar />
      <div className="calendar-page">
        <div className="container">
          <div className="calendar-page__header">
            <span className="section-tag">Disponibilités</span>
            <h1>Planning de la semaine</h1>
            <p>Cliquez sur un créneau disponible pour réserver, ou sur un jour libre pour faire une demande.</p>
          </div>
          <WeekCalendar
            slots={slots}
            children={children}
            isLoggedIn={!!user}
            onBooked={() => axios.get('/api/slots?all=true').then(r => setSlots(r.data))}
            showEmpty={true}
            mode="public"
          />
        </div>
      </div>
      <Footer />
      {contactDate !== null && <ContactModal onClose={() => setContactDate(null)} prefillDate={contactDate} />}
    </>
  )
}