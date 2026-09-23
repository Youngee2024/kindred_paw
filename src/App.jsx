import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'
import Home from './pages/Home'
import AuthPage from './pages/AuthPage'
import OwnerInfo from './pages/OwnerInfo'
import PetInfo from './pages/PetInfo'
import CompleteInfo from './pages/CompleteInfo'
import Dashboard from './pages/Dashboard'
import Quote from './pages/Quote'
import ApplicationProvider from './context/ApplicationProvider'

export default function App() {
  return (
    <ApplicationProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<AuthPage mode="login" />} />
          <Route path="/signup" element={<AuthPage mode="signup" />} />
          <Route path="/owner-info" element={<OwnerInfo />} />
          <Route path="/pet-info" element={<PetInfo />} />
          <Route path="/quote" element={<Quote />} />
          <Route path="/complete" element={<CompleteInfo />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </ApplicationProvider>
  )
}
