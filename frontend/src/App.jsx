import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { Toaster } from 'react-hot-toast'
import { AuthProvider } from './context/AuthContext'
import ProtectedRoute   from './components/layout/ProtectedRoute'
import ScrollToTop      from './components/layout/ScrollToTop'
import HomePage         from './pages/HomePage'
import LoginPage        from './pages/LoginPage'
import RegisterPage     from './pages/RegisterPage'
import ForgotPasswordPage from './pages/ForgotPasswordPage'
import ResetPasswordPage  from './pages/ResetPasswordPage'
import DashboardPage    from './pages/DashboardPage'
import CalendarPage    from './pages/CalendarPage'
import DocumentationPage from './pages/DocumentationPage'
import GardePage       from './pages/GardePage'
import RepitPage       from './pages/RepitPage'
import EvenementPage   from './pages/EvenementPage'
import ProfilePage      from './pages/ProfilePage'
import AdminDashboard   from './pages/admin/AdminDashboard'
import AdminActivities  from './pages/admin/AdminActivities'
import AdminContrats    from './pages/admin/AdminContrats'
import AdminTemoignages from './pages/admin/AdminTemoignages'
import AdminPhotos      from './pages/admin/AdminPhotos'
import AdminCompta      from './pages/admin/AdminCompta'
import AdminBookings    from './pages/admin/AdminBookings'
import AdminChildren    from './pages/admin/AdminChildren'
import AdminPlanning    from './pages/admin/AdminPlanning'
import AdminUsers       from './pages/admin/AdminUsers'
import AdminContacts    from './pages/admin/AdminContacts'
import AdminMessages    from './pages/admin/AdminMessages'
import AdminDocuments   from './pages/admin/AdminDocuments'
import AdminStats       from './pages/admin/AdminStats'
import './styles/global.css'

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Toaster position="top-right" toastOptions={{duration:3500}}/>
        <ScrollToTop />
        <Routes>
          <Route path="/"                element={<HomePage />} />
          <Route path="/calendrier"      element={<CalendarPage />} />
          <Route path="/documentation" element={<DocumentationPage />} />
          <Route path="/garde"           element={<GardePage />} />
          <Route path="/repit"           element={<RepitPage />} />
          <Route path="/evenements"      element={<EvenementPage />} />
          <Route path="/login"           element={<LoginPage />} />
          <Route path="/register"        element={<RegisterPage />} />
          <Route path="/forgot-password" element={<ForgotPasswordPage />} />
          <Route path="/reset-password"  element={<ResetPasswordPage />} />
          <Route path="/dashboard"       element={<ProtectedRoute><DashboardPage /></ProtectedRoute>} />
          <Route path="/profil"          element={<ProtectedRoute><ProfilePage /></ProtectedRoute>} />
          <Route path="/admin"               element={<ProtectedRoute adminOnly><AdminDashboard /></ProtectedRoute>} />
          <Route path="/admin/slots"         element={<ProtectedRoute adminOnly><AdminActivities /></ProtectedRoute>} />
          <Route path="/admin/compta"      element={<ProtectedRoute adminOnly><AdminCompta /></ProtectedRoute>} />
          <Route path="/admin/photos"      element={<ProtectedRoute adminOnly><AdminPhotos /></ProtectedRoute>} />
          <Route path="/admin/temoignages" element={<ProtectedRoute adminOnly><AdminTemoignages /></ProtectedRoute>} />
          <Route path="/admin/contrats"      element={<ProtectedRoute adminOnly><AdminContrats /></ProtectedRoute>} />
          <Route path="/admin/bookings"      element={<ProtectedRoute adminOnly><AdminBookings /></ProtectedRoute>} />
          <Route path="/admin/children"      element={<ProtectedRoute adminOnly><AdminChildren /></ProtectedRoute>} />
          <Route path="/admin/planning"      element={<ProtectedRoute adminOnly><AdminPlanning /></ProtectedRoute>} />
          <Route path="/admin/users"         element={<ProtectedRoute adminOnly><AdminUsers /></ProtectedRoute>} />
          <Route path="/admin/contacts"      element={<ProtectedRoute adminOnly><AdminContacts /></ProtectedRoute>} />
          <Route path="/admin/messages"      element={<ProtectedRoute adminOnly><AdminMessages /></ProtectedRoute>} />
          <Route path="/admin/documents"     element={<ProtectedRoute adminOnly><AdminDocuments /></ProtectedRoute>} />
          <Route path="/admin/stats"         element={<ProtectedRoute adminOnly><AdminStats /></ProtectedRoute>} />
          <Route path="*" element={<div style={{display:'flex',alignItems:'center',justifyContent:'center',minHeight:'100vh',flexDirection:'column',gap:'1rem'}}><h1 style={{fontFamily:"'Baloo 2',cursive",fontSize:'4rem',color:'var(--nuit)'}}>404</h1><p style={{color:'var(--text-muted)'}}>Page introuvable</p></div>} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  )
}