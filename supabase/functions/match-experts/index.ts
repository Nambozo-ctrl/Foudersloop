// supabase/functions/match-experts/index.ts

import { createClient } from "https://esm.sh/@supabase/supabase-js@2"

const ANTHROPIC_API_KEY = Deno.env.get("ANTHROPIC_API_KEY")
const SUPABASE_URL = Deno.env.get("SUPABASE_URL")
const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")

const CORS_HEADERS = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: CORS_HEADERS })
  }

  try {
    const { requestId } = await req.json()
    if (!requestId) {
      return new Response(JSON.stringify({ error: "requestId is required" }), {
        status: 400,
        headers: { ...CORS_HEADERS, "Content-Type": "application/json" },
      })
    }

    const supabase = createClient(SUPABASE_URL ?? "", SUPABASE_SERVICE_ROLE_KEY ?? "")

    const { data: request, error: requestError } = await supabase
      .from("requests")
      .select("id, title, details")
      .eq("id", requestId)
      .single()

    if (requestError || !request) {
      return new Response(JSON.stringify({ error: "Request not found" }), {
        status: 404,
        headers: { ...CORS_HEADERS, "Content-Type": "application/json" },
      })
    }

    const { data: experts, error: expertsError } = await supabase
      .from("profiles")
      .select("id, name, focus_area")
      .eq("role", "expert")
      .not("focus_area", "is", null)

    if (expertsError) {
      return new Response(JSON.stringify({ error: "Could not load experts" }), {
        status: 500,
        headers: { ...CORS_HEADERS, "Content-Type": "application/json" },
      })
    }

    if (!experts || experts.length === 0) {
      return new Response(JSON.stringify({ matches: [] }), {
        headers: { ...CORS_HEADERS, "Content-Type": "application/json" },
      })
    }

    const expertList = experts
      .map((e: { id: string; name: string; focus_area: string }) => `- id: ${e.id}, name: ${e.name}, expertise: ${e.focus_area}`)
      .join("\n")

    const prompt = `A founder posted this request on FounderLoop:

Title: ${request.title}
Details: ${request.details}

Here is the list of registered experts and their stated area of expertise:

${expertList}

Pick the top 3 experts (or fewer if fewer than 3 are a reasonable fit) whose expertise best matches this request. Respond with ONLY valid JSON, no other text, in this exact shape:

{"matches": [{"id": "<expert id>", "reason": "<one short sentence on why this expert fits>"}]}

If none of the experts are a reasonable fit, return {"matches": []}.`

    const anthropicRes = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": ANTHROPIC_API_KEY ?? "",
        "anthropic-version": "2023-06-01",
      },
      body: JSON.stringify({
        model: "claude-haiku-4-5-20251001",
        max_tokens: 500,
        messages: [{ role: "user", content: prompt }],
      }),
    })

    if (!anthropicRes.ok) {
      const errText = await anthropicRes.text()
      return new Response(
        JSON.stringify({ error: "AI matching failed", detail: errText }),
        { status: 502, headers: { ...CORS_HEADERS, "Content-Type": "application/json" } }
      )
    }

    const data = await anthropicRes.json()
    const raw = data.content?.find((b: { type: string }) => b.type === "text")?.text ?? "{}"

    let parsed
    try {
      parsed = JSON.parse(raw)
    } catch {
      return new Response(JSON.stringify({ error: "Could not parse AI response", detail: raw }), {
        status: 502,
        headers: { ...CORS_HEADERS, "Content-Type": "application/json" },
      })
    }

    const expertsById = new Map(experts.map((e: { id: string }) => [e.id, e]))
    const matches = (parsed.matches ?? [])
      .map((m: { id: string; reason: string }) => {
        const expert = expertsById.get(m.id)
        if (!expert) return null
        return { id: expert.id, name: expert.name, focus_area: expert.focus_area, reason: m.reason }
      })
      .filter(Boolean)

    return new Response(JSON.stringify({ matches }), {
      headers: { ...CORS_HEADERS, "Content-Type": "application/json" },
    })
  } catch (err) {
    return new Response(JSON.stringify({ error: String(err) }), {
      status: 500,
      headers: { ...CORS_HEADERS, "Content-Type": "application/json" },
    })
  }
})
