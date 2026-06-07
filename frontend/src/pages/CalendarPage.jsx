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
  const [contractedDates, setContractedDates] = useState([])
  const [indispos, setIndispos] = useState([])
  const [contactDate, setContactDate] = useState(null)
  const [children, setChildren] = useState([])

  useEffect(() => {
    axios.get('/api/slots?all=true').then(r => setSlots(r.data)).catch(() => {})
    axios.get('/api/indisponibilites').then(r => setIndispos(r.data)).catch(() => {})
    // Charger les contrats actifs pour marquer les jours
    axios.get('/api/contrats/calendrier').then(r => {
      const dates = []
      r.data.forEach(c => {
        if (!c.date_debut || !c.date_fin) return
        const start = new Date(c.date_debut+'T00:00:00')
        const end   = new Date(c.date_fin+'T00:00:00')
        const jours = c.jours_semaine ? c.jours_semaine.split(',').filter(Boolean).map(Number) : []
        const cur   = new Date(start)
        while (cur <= end) {
          const dow = (cur.getDay()+6)%7
          if (jours.length===0 || jours.includes(dow)) {
            dates.push(cur.toISOString().slice(0,10))
          }
          cur.setDate(cur.getDate()+1)
        }
      })
      setContractedDates([...new Set(dates)])
    }).catch(()=>{})
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
            contractedDates={contractedDates}
            indisponibilites={indispos}
          />
        </div>
      </div>
      <Footer />
      {contactDate !== null && <ContactModal onClose={() => setContactDate(null)} prefillDate={contactDate} />}
    </>
  )
}