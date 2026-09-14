import { Routes, Route, Navigate } from 'react-router-dom'
import { useAuth } from './lib/AuthContext'
import Navbar from './components/Navbar'
import Landing from './pages/Landing'
import SignUp from './pages/SignUp'
import Login from './pages/Login'
import Feed from './pages/Feed'
import RequestDetail from './pages/RequestDetail'

function RequireAuth({ children }) {
  const { session, loading } = useAuth()
  if (loading) return <p className="text-center py-20 text-ink-soft">Loading…</p>
  if (!session) return <Navigate to="/login" replace />
  return children
}

export default function App() {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1">
        <Routes>
          <Route path="/" element={<Landing />} />
          <Route path="/signup" element={<SignUp />} />
          <Route path="/login" element={<Login />} />
          <Route
            path="/feed"
            element={
              <RequireAuth>
                <Feed />
              </RequireAuth>
            }
          />
          <Route
            path="/requests/:id"
            element={
              <RequireAuth>
                <RequestDetail />
              </RequireAuth>
            }
          />
        </Routes>
      </main>
    </div>
  )
}
