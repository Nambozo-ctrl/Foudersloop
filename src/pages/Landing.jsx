import { Link } from 'react-router-dom'

export default function Landing() {
  return (
    <div>
      <section className="max-w-5xl mx-auto px-6 pt-20 pb-24">
        <div className="max-w-2xl">
          <p className="font-display text-ask-deep text-lg mb-4">Ask. Answer. Loop.</p>
          <h1 className="font-display text-5xl sm:text-6xl leading-[1.05] text-ink mb-8">
            Founders get stuck. Experts already know the way out.
          </h1>
          <p className="text-lg text-ink-soft leading-relaxed mb-10 max-w-lg">
            FounderLoop is an open feed where a founder posts the question
            keeping them up at night, and an expert who's already solved it
            writes back. No matching, no gatekeeping — just the loop, running
            in public.
          </p>
          <div className="flex flex-wrap gap-4">
            <Link
              to="/signup"
              className="bg-ask text-ink px-6 py-3 rounded-full font-medium hover:bg-ask-deep hover:text-paper transition-colors"
            >
              Post a question
            </Link>
            <Link
              to="/signup"
              className="border border-ink px-6 py-3 rounded-full font-medium hover:bg-ink hover:text-paper transition-colors"
            >
              Answer as an expert
            </Link>
          </div>
        </div>
      </section>

      <section className="border-t border-line bg-paper-raised">
        <div className="max-w-5xl mx-auto px-6 py-16 grid sm:grid-cols-3 gap-10">
          <div>
            <div className="w-8 h-8 rounded-full bg-ask flex items-center justify-center font-display text-ink mb-4">
              1
            </div>
            <h3 className="font-display text-xl mb-2">A founder asks</h3>
            <p className="text-ink-soft text-sm leading-relaxed">
              A real problem, posted plainly — pricing, hiring, a stuck
              pipeline, a term sheet that doesn't sit right.
            </p>
          </div>
          <div>
            <div className="w-8 h-8 rounded-full bg-answer flex items-center justify-center font-display text-paper mb-4">
              2
            </div>
            <h3 className="font-display text-xl mb-2">An expert answers</h3>
            <p className="text-ink-soft text-sm leading-relaxed">
              Anyone on the expert side of the feed can weigh in — no
              introductions or scheduling required.
            </p>
          </div>
          <div>
            <div className="w-8 h-8 rounded-full border border-ink flex items-center justify-center font-display text-ink mb-4">
              3
            </div>
            <h3 className="font-display text-xl mb-2">The loop closes</h3>
            <p className="text-ink-soft text-sm leading-relaxed">
              The founder reads it, acts on it, and the next question goes up.
              That's the whole product.
            </p>
          </div>
        </div>
      </section>
    </div>
  )
}
