import { useEffect, useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import { supabase } from '../lib/supabaseClient'
import { useAuth } from '../lib/AuthContext'

export default function RequestDetail() {
  const { id } = useParams()
  const { profile } = useAuth()
  const [request, setRequest] = useState(null)
  const [responses, setResponses] = useState([])
  const [loading, setLoading] = useState(true)
  const [body, setBody] = useState('')
  const [posting, setPosting] = useState(false)
  const [drafting, setDrafting] = useState(false)

  async function load() {
    setLoading(true)
    const { data: req } = await supabase
      .from('requests')
      .select('*, profiles(name)')
      .eq('id', id)
      .single()
    const { data: res } = await supabase
      .from('responses')
      .select('*, profiles(name)')
      .eq('request_id', id)
      .order('created_at', { ascending: true })
    setRequest(req)
    setResponses(res || [])
    setLoading(false)
  }

  useEffect(() => {
    load()
  }, [id])

  async function handleGenerateDraft() {
    setDrafting(true)
    try {
      const { data, error } = await supabase.functions.invoke('draft-response', {
        body: {
          title: request.title,
          detail: request.details,
        },
      })
      if (error) throw error
      setBody(data.draft || '')
    } catch (err) {
      console.error('Draft generation failed', err)
    } finally {
      setDrafting(false)
    }
  }

  async function handleRespond(e) {
    e.preventDefault()
    setPosting(true)
    await supabase.from('responses').insert({
      request_id: id,
      expert_id: profile.id,
      body,
    })
    setBody('')
    setPosting(false)
    load()
  }

  if (loading) {
    return <p className="max-w-2xl mx-auto px-6 py-12 text-ink-soft">Loading…</p>
  }

  if (!request) {
    return (
      <div className="max-w-2xl mx-auto px-6 py-12">
        <p className="text-ink-soft mb-4">This question doesn't exist anymore.</p>
        <Link to="/feed" className="underline">
          Back to the feed
        </Link>
      </div>
    )
  }

  return (
    <div className="max-w-2xl mx-auto px-6 py-12">
      <Link to="/feed" className="text-sm text-ink-soft hover:text-ink mb-8 inline-block">
        ← Back to the feed
      </Link>

      <div className="border-l-4 border-ask pl-6 mb-12">
        <h1 className="font-display text-3xl mb-3">{request.title}</h1>
        <p className="text-ink-soft leading-relaxed mb-3">{request.details}</p>
        <p className="text-xs text-ink-soft">
          Asked by {request.profiles?.name || 'a founder'}
        </p>
      </div>

      <h2 className="font-display text-xl mb-5">
        {responses.length === 0
          ? 'No answers yet'
          : `${responses.length} ${responses.length === 1 ? 'answer' : 'answers'}`}
      </h2>

      <ul className="space-y-6 mb-10">
        {responses.map((r) => (
          <li key={r.id} className="border-l-4 border-answer pl-6">
            <p className="text-ink leading-relaxed mb-2">{r.body}</p>
            <p className="text-xs text-ink-soft">
              {r.profiles?.name || 'An expert'}
            </p>
          </li>
        ))}
      </ul>

      {profile?.role === 'expert' && (
        <form onSubmit={handleRespond} className="border-t border-line pt-8">
          <label className="block text-sm font-medium mb-1.5">
            Add your answer
          </label>
          <textarea
            required
            rows={4}
            value={body}
            onChange={(e) => setBody(e.target.value)}
            className="w-full border border-line rounded-lg px-4 py-2.5 mb-4 focus:outline-none focus:ring-2 focus:ring-answer"
          />
          <div className="flex items-center gap-3">
            <button
              type="submit"
              disabled={posting}
              className="bg-answer text-paper px-5 py-2.5 rounded-full font-medium hover:bg-answer-deep transition-colors disabled:opacity-50"
            >
              {posting ? 'Posting…' : 'Post answer'}
            </button>
            <button
              type="button"
              onClick={handleGenerateDraft}
              disabled={drafting}
              className="border border-line px-5 py-2.5 rounded-full font-medium hover:bg-paper-soft transition-colors disabled:opacity-50"
            >
              {drafting ? 'Drafting…' : 'Generate draft'}
            </button>
          </div>
        </form>
      )}
    </div>
  )
}
