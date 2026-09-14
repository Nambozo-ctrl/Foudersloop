import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useAuth } from '../lib/AuthContext'

export default function Login() {
  const { signIn } = useAuth()
  const navigate = useNavigate()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState(null)
  const [loading, setLoading] = useState(false)

  async function handleSubmit(e) {
    e.preventDefault()
    setLoading(true)
    setError(null)
    const { error } = await signIn({ email, password })
    setLoading(false)
    if (error) {
      setError(error.message)
      return
    }
    navigate('/feed')
  }

  return (
    <div className="max-w-md mx-auto px-6 py-16">
      <h1 className="font-display text-3xl mb-2">Welcome back</h1>
      <p className="text-ink-soft mb-10">Sign in to your FounderLoop account.</p>

      <form onSubmit={handleSubmit} className="space-y-5">
        <div>
          <label className="block text-sm font-medium mb-1.5">Email</label>
          <input
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full border border-line rounded-lg px-4 py-2.5 bg-paper-raised focus:outline-none focus:ring-2 focus:ring-ask"
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1.5">Password</label>
          <input
            type="password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full border border-line rounded-lg px-4 py-2.5 bg-paper-raised focus:outline-none focus:ring-2 focus:ring-ask"
          />
        </div>

        {error && <p className="text-sm text-ask-deep">{error}</p>}

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-ink text-paper py-3 rounded-full font-medium hover:bg-ink-soft transition-colors disabled:opacity-50"
        >
          {loading ? 'Signing in…' : 'Sign in'}
        </button>
      </form>

      <p className="text-sm text-ink-soft mt-6">
        New here?{' '}
        <Link to="/signup" className="text-ink underline">
          Create an account
        </Link>
      </p>
    </div>
  )
}
