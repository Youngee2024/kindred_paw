import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'
import Home from './pages/Home'
import AuthPage from './pages/AuthPage'
import OwnerInfo from './pages/OwnerInfo'
import PetInfo from './pages/PetInfo'
import CompleteInfo from './pages/CompleteInfo'

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<AuthPage mode="login" />} />
        <Route path="/signup" element={<AuthPage mode="signup" />} />
        <Route path="/owner-info" element={<OwnerInfo />} />
        <Route path="/pet-info" element={<PetInfo />} />
        <Route path="/complete" element={<CompleteInfo />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  )
}
