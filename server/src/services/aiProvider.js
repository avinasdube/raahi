// Provider-agnostic AI caller with OpenAI support and safe fallback
// No SDKs required; uses global fetch (Node 18+). If provider or key
// is missing, callers should handle by using a deterministic fallback.

export async function callLLMWithPlanPrompt({
  provider,
  apiKey,
  model,
  prompt,
  system,
}) {
  provider = (provider || "").toLowerCase();
  if (!provider || provider === "off") {
    return { ok: false, reason: "provider_off" };
  }

  try {
    switch (provider) {
      case "openai": {
        if (!apiKey) return { ok: false, reason: "no_api_key" };
        const resp = await fetch("https://api.openai.com/v1/chat/completions", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${apiKey}`,
          },
          body: JSON.stringify({
            model: model || "gpt-4o-mini",
            messages: [
              system ? { role: "system", content: system } : null,
              { role: "user", content: prompt },
            ].filter(Boolean),
            temperature: 0.7,
            response_format: { type: "json_object" },
          }),
        });
        if (!resp.ok) {
          const text = await resp.text();
          return { ok: false, reason: `http_${resp.status}`, details: text };
        }
        const data = await resp.json();
        const content = data?.choices?.[0]?.message?.content;
        return { ok: true, content, provider: "openai" };
      }
      // Placeholders for additional providers; return off until configured
      case "anthropic":
      case "mistral":
      case "google":
      case "azure-openai":
        return { ok: false, reason: "provider_not_implemented" };
      default:
        return { ok: false, reason: "unknown_provider" };
    }
  } catch (err) {
    return {
      ok: false,
      reason: "exception",
      details: String(err?.message || err),
    };
  }
}
