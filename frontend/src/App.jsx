import { BrowserRouter, Route, Routes } from 'react-router-dom'
import PersonalizedInvitationPage from './pages/PersonalizedInvitationPage'
import InvitationPage from './pages/InvitationPage'
import AdminPage from './pages/AdminPage'
import DoorControlPage from './pages/DoorControlPage'

function NotFoundPage() {
  return <main className="status-screen error-screen"><h1>Enlace no disponible</h1><p>Esta invitación utiliza un enlace personalizado para cada familia.</p></main>
}

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/invitacion/:slug/rsvp/:token" element={<PersonalizedInvitationPage />} />
        <Route path="/invitacion/:slug/:token" element={<PersonalizedInvitationPage />} />
        <Route path="/invitacion/:slug" element={<InvitationPage />} />
        <Route path="/control-acceso/:slug/:doorKey" element={<DoorControlPage />} />
        <Route path="/puerta/:slug/:doorKey" element={<DoorControlPage />} />
        <Route path="/admin" element={<AdminPage />} />
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
