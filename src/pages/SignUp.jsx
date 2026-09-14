import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useAuth } from '../lib/AuthContext'

export default function SignUp() {
  const { signUp } = useAuth()
  const navigate = useNavigate()
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [role, setRole] = useState('founder')
  const [error, setError] = useState(null)
  const [loading, setLoading] = useState(false)

  async function handleSubmit(e) {
    e.preventDefault()
    setLoading(true)
    setError(null)
    const { error } = await signUp({ email, password, name, role })
    setLoading(false)
    if (error) {
      setError(error.message)
      return
    }
    navigate('/feed')
  }

  return (
    <div className="max-w-md mx-auto px-6 py-16">
      <h1 className="font-display text-3xl mb-2">Join the loop</h1>
      <p className="text-ink-soft mb-10">
        Sign up as a founder to ask, or an expert to answer.
      </p>

      <div className="flex gap-3 mb-8">
        <button
          type="button"
          onClick={() => setRole('founder')}
          className={`flex-1 py-3 rounded-full border font-medium transition-colors ${
            role === 'founder'
              ? 'bg-ask border-ask text-ink'
              : 'border-line text-ink-soft hover:border-ink'
          }`}
        >
          I'm a founder
        </button>
        <button
          type="button"
          onClick={() => setRole('expert')}
          className={`flex-1 py-3 rounded-full border font-medium transition-colors ${
            role === 'expert'
              ? 'bg-answer border-answer text-paper'
              : 'border-line text-ink-soft hover:border-ink'
          }`}
        >
          I'm an expert
        </button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-5">
        <div>
          <label className="block text-sm font-medium mb-1.5">Name</label>
          <input
            type="text"
            required
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full border border-line rounded-lg px-4 py-2.5 bg-paper-raised focus:outline-none focus:ring-2 focus:ring-ask"
          />
        </div>
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
            minLength={6}
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
          {loading ? 'Creating account…' : 'Create account'}
        </button>
      </form>

      <p className="text-sm text-ink-soft mt-6">
        Already have an account?{' '}
        <Link to="/login" className="text-ink underline">
          Sign in
        </Link>
      </p>
    </div>
  )
}
