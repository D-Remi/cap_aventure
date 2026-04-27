import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { Toaster } from 'react-hot-toast'
import { AuthProvider, useAuth } from './context/AuthContext'
import { useNotifications } from './hooks/useNotifications'
import ProtectedRoute from './components/layout/ProtectedRoute'
import PWAInstallBanner from './components/ui/PWAInstallBanner'
import ScrollToTop from './components/layout/ScrollToTop'
import Navbar from './components/layout/Navbar'
import Footer from './components/layout/Footer'
import HomePage           from './pages/HomePage'
import LoginPage          from './pages/LoginPage'
import RegisterPage       from './pages/RegisterPage'
import ForgotPasswordPage from './pages/ForgotPasswordPage'
import ResetPasswordPage  from './pages/ResetPasswordPage'
import ProfilePage        from './pages/ProfilePage'
import DashboardPage      from './pages/DashboardPage'
import CalendarPage       from './pages/CalendarPage'
import ActivityPage       from './pages/ActivityPage'
import ActivityInfoPage   from './pages/ActivityInfoPage'
import AdminDashboard     from './pages/admin/AdminDashboard'
import AdminActivities    from './pages/admin/AdminActivities'
import AdminRegistrations from './pages/admin/AdminRegistrations'
import AdminUsers         from './pages/admin/AdminUsers'
import AdminInterest      from './pages/admin/AdminInterest'
import AdminDocuments     from './pages/admin/AdminDocuments'
import AdminPoints        from './pages/admin/AdminPoints'
import AdminStats         from './pages/admin/AdminStats'
import AdminMessages      from './pages/admin/AdminMessages'
import AdminPlanning   from './pages/admin/AdminPlanning'
import AdminAttendance    from './pages/admin/AdminAttendance'
import './styles/global.css'
import './pages/admin/AdminDashboard.css'
import './components/ui/PWAInstallBanner.css'

function PublicLayout({ children }) {
  return (
    <>
      <Navbar />
      <main>{children}</main>
      <Footer />
    </>
  )
}

function AppRoutes() {
  const { user } = useAuth()
  useNotifications(user)

  return (
    <>
      <ScrollToTop />
      <PWAInstallBanner />
      <Routes>
        <Route path="/"                element={<PublicLayout><HomePage /></PublicLayout>} />
        <Route path="/calendrier"      element={<CalendarPage />} />
        <Route path="/activites/:id"        element={<ActivityPage />} />
        <Route path="/activites-info/:slug" element={<ActivityInfoPage />} />
        <Route path="/login"           element={<LoginPage />} />
        <Route path="/register"        element={<RegisterPage />} />
        <Route path="/forgot-password" element={<ForgotPasswordPage />} />
        <Route path="/reset-password"  element={<ResetPasswordPage />} />

        <Route path="/dashboard" element={<ProtectedRoute><DashboardPage /></ProtectedRoute>} />
        <Route path="/profil"    element={<ProtectedRoute><ProfilePage /></ProtectedRoute>} />

        <Route path="/admin"               element={<ProtectedRoute adminOnly><AdminDashboard /></ProtectedRoute>} />
        <Route path="/admin/activities"    element={<ProtectedRoute adminOnly><AdminActivities /></ProtectedRoute>} />
        <Route path="/admin/registrations" element={<ProtectedRoute adminOnly><AdminRegistrations /></ProtectedRoute>} />
        <Route path="/admin/users"         element={<ProtectedRoute adminOnly><AdminUsers /></ProtectedRoute>} />
        <Route path="/admin/documents"     element={<ProtectedRoute adminOnly><AdminDocuments /></ProtectedRoute>} />
        <Route path="/admin/interest"      element={<ProtectedRoute adminOnly><AdminInterest /></ProtectedRoute>} />
        <Route path="/admin/stats"         element={<ProtectedRoute adminOnly><AdminStats /></ProtectedRoute>} />
        <Route path="/admin/points"        element={<ProtectedRoute adminOnly><AdminPoints /></ProtectedRoute>} />
        <Route path="/admin/messages"      element={<ProtectedRoute adminOnly><AdminMessages /></ProtectedRoute>} />
        <Route path="/admin/planning" element={<AdminPlanning />} />
          <Route path="/admin/attendance"    element={<ProtectedRoute adminOnly><AdminAttendance /></ProtectedRoute>} />

        <Route path="*" element={
          <PublicLayout>
            <div style={{ minHeight:'60vh', display:'flex', alignItems:'center', justifyContent:'center', flexDirection:'column', gap:'1rem' }}>
              <h1 style={{ fontFamily:"'Baloo 2',cursive", fontSize:'4rem', color:'var(--bleu-nuit)' }}>404</h1>
              <p style={{ color:'var(--text-muted)' }}>Page introuvable</p>
            </div>
          </PublicLayout>
        } />
      </Routes>
    </>
  )
}

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Toaster position="top-right" toastOptions={{ duration: 3500 }} />
        <AppRoutes />
      </BrowserRouter>
    </AuthProvider>
  )
}

