import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { Toaster } from 'react-hot-toast'
import { AuthProvider } from './context/AuthContext'
import ProtectedRoute       from './components/layout/ProtectedRoute'
import ServicesPage        from './pages/ServicesPage'
import ConfidentialitePage from './pages/ConfidentialitePage'
import ScrollToTop          from './components/layout/ScrollToTop'
import HomePage             from './pages/HomePage'
import LoginPage            from './pages/LoginPage'
import RegisterPage         from './pages/RegisterPage'
import ForgotPasswordPage   from './pages/ForgotPasswordPage'
import ResetPasswordPage    from './pages/ResetPasswordPage'
import DashboardPage        from './pages/DashboardPage'
import DocumentationPage    from './pages/DocumentationPage'
import ProfilePage          from './pages/ProfilePage'
import AdminDashboard       from './pages/admin/AdminDashboard'
import AdminSeances         from './pages/admin/AdminSeances'
import AdminChildren        from './pages/admin/AdminChildren'
import AdminUsers           from './pages/admin/AdminUsers'
import AdminContacts        from './pages/admin/AdminContacts'
import AdminMessages        from './pages/admin/AdminMessages'
import AdminDocuments       from './pages/admin/AdminDocuments'
import AdminPhotos          from './pages/admin/AdminPhotos'
import AdminCompta          from './pages/admin/AdminCompta'
import AdminGardes          from './pages/admin/AdminGardes'
import AdminContrats        from './pages/admin/AdminContrats'
import AdminTemoignages     from './pages/admin/AdminTemoignages'
import AdminStats           from './pages/admin/AdminStats'
import FrontaliersPage      from './pages/FrontaliersPage'
import MentionsLegalesPage  from './pages/MentionsLegalesPage'
import CgvPage              from './pages/CgvPage'
import AdminEntreprise      from './pages/admin/AdminEntreprise'
import AdminDeclarations    from './pages/admin/AdminDeclarations'
import AdminDevis           from './pages/admin/AdminDevis'
import AdminReseaux         from './pages/admin/AdminReseaux'
import AdminRadar           from './pages/admin/AdminRadar'
import './styles/global.css'
import './styles/site.css'

function NotFound() {
  return (
    <div style={{
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      minHeight: '100vh', flexDirection: 'column', gap: '1rem',
    }}>
      <h1 style={{ fontSize: '4rem', fontWeight: 700, color: 'var(--ink)', letterSpacing: '-.04em' }}>404</h1>
      <p style={{ color: 'var(--soft)' }}>Cette page n'existe pas.</p>
      <a href="/" className="btn-primary" style={{ marginTop: '.5rem' }}>Retour à l'accueil</a>
    </div>
  )
}

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Toaster position="top-right" toastOptions={{ duration: 3500 }} />
        <ScrollToTop />
        <Routes>
          {/* Public */}
          <Route path="/"                element={<HomePage />} />
          <Route path="/documentation"   element={<DocumentationPage />} />
          <Route path="/services"        element={<ServicesPage />} />
          <Route path="/tarifs"          element={<ServicesPage />} />
          <Route path="/frontaliers-suisse" element={<FrontaliersPage />} />
          <Route path="/mentions-legales" element={<MentionsLegalesPage />} />
          <Route path="/cgv"             element={<CgvPage />} />
          <Route path="/confidentialite" element={<ConfidentialitePage />} />
          <Route path="/login"           element={<LoginPage />} />
          <Route path="/register"        element={<RegisterPage />} />
          <Route path="/forgot-password" element={<ForgotPasswordPage />} />
          <Route path="/reset-password"  element={<ResetPasswordPage />} />

          {/* Famille */}
          <Route path="/dashboard" element={<ProtectedRoute><DashboardPage /></ProtectedRoute>} />
          <Route path="/profil"    element={<ProtectedRoute><ProfilePage /></ProtectedRoute>} />

          {/* Admin */}
          <Route path="/admin"             element={<ProtectedRoute adminOnly><AdminDashboard /></ProtectedRoute>} />
          <Route path="/admin/seances"     element={<ProtectedRoute adminOnly><AdminSeances /></ProtectedRoute>} />
          <Route path="/admin/children"    element={<ProtectedRoute adminOnly><AdminChildren /></ProtectedRoute>} />
          <Route path="/admin/users"       element={<ProtectedRoute adminOnly><AdminUsers /></ProtectedRoute>} />
          <Route path="/admin/contacts"    element={<ProtectedRoute adminOnly><AdminContacts /></ProtectedRoute>} />
          <Route path="/admin/messages"    element={<ProtectedRoute adminOnly><AdminMessages /></ProtectedRoute>} />
          <Route path="/admin/documents"   element={<ProtectedRoute adminOnly><AdminDocuments /></ProtectedRoute>} />
          <Route path="/admin/photos"      element={<ProtectedRoute adminOnly><AdminPhotos /></ProtectedRoute>} />
          <Route path="/admin/compta"      element={<ProtectedRoute adminOnly><AdminCompta /></ProtectedRoute>} />
          <Route path="/admin/gardes"      element={<ProtectedRoute adminOnly><AdminGardes /></ProtectedRoute>} />
          <Route path="/admin/contrats"    element={<ProtectedRoute adminOnly><AdminContrats /></ProtectedRoute>} />
          <Route path="/admin/temoignages" element={<ProtectedRoute adminOnly><AdminTemoignages /></ProtectedRoute>} />
          <Route path="/admin/stats"       element={<ProtectedRoute adminOnly><AdminStats /></ProtectedRoute>} />
          <Route path="/admin/declarations" element={<ProtectedRoute adminOnly><AdminDeclarations /></ProtectedRoute>} />
          <Route path="/admin/devis"       element={<ProtectedRoute adminOnly><AdminDevis /></ProtectedRoute>} />
          <Route path="/admin/entreprise"  element={<ProtectedRoute adminOnly><AdminEntreprise /></ProtectedRoute>} />
          <Route path="/admin/reseaux"     element={<ProtectedRoute adminOnly><AdminReseaux /></ProtectedRoute>} />
          <Route path="/admin/radar"       element={<ProtectedRoute adminOnly><AdminRadar /></ProtectedRoute>} />

          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  )
}
