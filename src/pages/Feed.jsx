import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { supabase } from '../lib/supabaseClient'
import { useAuth } from '../lib/AuthContext'

export default function Feed() {
  const { profile } = useAuth()
  const [requests, setRequests] = useState([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [title, setTitle] = useState('')
  const [details, setDetails] = useState('')
  const [posting, setPosting] = useState(false)

  async function loadRequests() {
    setLoading(true)
    const { data } = await supabase
      .from('requests')
      .select('*, profiles(name), responses(id)')
      .order('created_at', { ascending: false })
    setRequests(data || [])
    setLoading(false)
  }

  useEffect(() => {
    loadRequests()
  }, [])

  async function handlePost(e) {
    e.preventDefault()
    setPosting(true)
    await supabase.from('requests').insert({
      founder_id: profile.id,
      title,
      details,
    })
    setTitle('')
    setDetails('')
    setShowForm(false)
    setPosting(false)
    loadRequests()
  }

  return (
    <div className="max-w-3xl mx-auto px-6 py-12">
      <div className="flex items-center justify-between mb-10">
        <h1 className="font-display text-3xl">The open feed</h1>
        {profile?.role === 'founder' && (
          <button
            onClick={() => setShowForm((s) => !s)}
            className="bg-ask text-ink px-5 py-2.5 rounded-full font-medium hover:bg-ask-deep hover:text-paper transition-colors"
          >
            {showForm ? 'Cancel' : 'Ask something'}
          </button>
        )}
      </div>

      {showForm && (
        <form
          onSubmit={handlePost}
          className="border border-line rounded-xl p-6 mb-10 bg-paper-raised"
        >
          <div className="mb-4">
            <label className="block text-sm font-medium mb-1.5">
              What's the question?
            </label>
            <input
              type="text"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. How do I price a B2B pilot with no comps?"
              className="w-full border border-line rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-ask"
            />
          </div>
          <div className="mb-5">
            <label className="block text-sm font-medium mb-1.5">
              Give it some context
            </label>
            <textarea
              required
              rows={4}
              value={details}
              onChange={(e) => setDetails(e.target.value)}
              className="w-full border border-line rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-ask"
            />
          </div>
          <button
            type="submit"
            disabled={posting}
            className="bg-ink text-paper px-5 py-2.5 rounded-full font-medium hover:bg-ink-soft transition-colors disabled:opacity-50"
          >
            {posting ? 'Posting…' : 'Post to the feed'}
          </button>
        </form>
      )}

      {loading ? (
        <p className="text-ink-soft">Loading the feed…</p>
      ) : requests.length === 0 ? (
        <p className="text-ink-soft">
          Nothing's been asked yet. Be the first to start the loop.
        </p>
      ) : (
        <ul className="space-y-6">
          {requests.map((r) => (
            <li key={r.id}>
              <Link
                to={`/requests/${r.id}`}
                className="block border-b border-line pb-6 hover:opacity-80 transition-opacity"
              >
                <h2 className="font-display text-xl mb-1.5">{r.title}</h2>
                <p className="text-ink-soft text-sm mb-3 line-clamp-2">
                  {r.details}
                </p>
                <div className="flex items-center gap-3 text-xs text-ink-soft">
                  <span>Asked by {r.profiles?.name || 'a founder'}</span>
                  <span className="text-line">·</span>
                  <span className="text-answer-deep">
                    {r.responses?.length || 0}{' '}
                    {r.responses?.length === 1 ? 'answer' : 'answers'}
                  </span>
                </div>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}
