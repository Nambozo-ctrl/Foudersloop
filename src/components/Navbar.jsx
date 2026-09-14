import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../lib/AuthContext'

export default function Navbar() {
  const { session, profile, signOut } = useAuth()
  const navigate = useNavigate()

  async function handleSignOut() {
    await signOut()
    navigate('/')
  }

  return (
    <header className="border-b border-line">
      <div className="max-w-5xl mx-auto px-6 py-5 flex items-center justify-between">
        <Link to="/" className="font-display text-xl text-ink">
          FounderLoop
        </Link>
        <nav className="flex items-center gap-6 text-sm">
          {session ? (
            <>
              <Link to="/feed" className="hover:text-ask-deep">
                Feed
              </Link>
              <span className="text-ink-soft">
                {profile?.name}
                <span className="text-line mx-1">·</span>
                {profile?.role}
              </span>
              <button onClick={handleSignOut} className="hover:text-ask-deep">
                Sign out
              </button>
            </>
          ) : (
            <>
              <Link to="/login" className="hover:text-ask-deep">
                Sign in
              </Link>
              <Link
                to="/signup"
                className="bg-ink text-paper px-4 py-2 rounded-full hover:bg-ink-soft transition-colors"
              >
                Join the loop
              </Link>
            </>
          )}
        </nav>
      </div>
    </header>
  )
}
