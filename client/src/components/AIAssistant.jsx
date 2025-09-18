import { CreateMLCEngine } from "@mlc-ai/web-llm";
import { useEffect, useRef, useState } from "react";

// Lightweight AI chat using WebLLM (runs in-browser, no API key)
// Notes:
// - Requires a modern browser with WebGPU for best performance.
// - Falls back to slower WebAssembly if needed.
// - Model is downloaded on first use (network required) and cached by the browser.

const DEFAULT_SYSTEM =
  "You are Raahi, an India-first travel assistant. Be concise, friendly, and practical. Focus on Indian cities, seasons, transport tips, budgets, and cultural context. Suggest day-by-day plans and dining/local experiences where relevant.";

export default function AIAssistant({
  prefill,
  onResponse,
  prompt,
  autoSendKey,
}) {
  const [engine, setEngine] = useState(null);
  const [loadingModel, setLoadingModel] = useState(true);
  const [progress, setProgress] = useState("");
  const [error, setError] = useState("");
  const [messages, setMessages] = useState([
    { role: "system", content: DEFAULT_SYSTEM },
  ]);
  const [input, setInput] = useState(
    prefill || "Plan a 3-day trip to Jaipur on a moderate budget."
  );
  const [streaming, setStreaming] = useState(false);
  const abortRef = useRef(null);
  const lastKeySentRef = useRef(0);

  useEffect(() => {
    let disposed = false;
    (async () => {
      try {
        setLoadingModel(true);
        setError("");
        const eng = await CreateMLCEngine(
          // A small general model that runs in-browser. You can change to other available models.
          "Llama-3.1-8B-Instruct-q4f32_1-MLC",
          {
            // progressCallback can update a small progress UI if desired
            initProgressCallback: (p) => {
              // p is a string status from WebLLM (e.g., downloading, compiling, warming up)
              setProgress(String(p ?? ""));
            },
          }
        );
        if (!disposed) {
          setEngine(eng);
        }
      } catch (e) {
        console.error("WebLLM init error", e);
        setError(
          "Failed to initialize the in-browser model. Your browser may not support WebGPU or a network error occurred. Try a modern Chromium browser and reload."
        );
      } finally {
        if (!disposed) setLoadingModel(false);
      }
    })();
    return () => {
      disposed = true;
      try {
        abortRef.current?.abort?.();
      } catch (err) {
        void err; // ignore
      }
    };
  }, []);

  const send = async (text) => {
    if (!engine || streaming) return;
    const userMsg = { role: "user", content: text };
    const next = [...messages, userMsg];
    setMessages(next);
    setStreaming(true);
    const controller = new AbortController();
    abortRef.current = controller;

    let assistant = { role: "assistant", content: "" };
    setMessages((m) => [...m, assistant]);

    try {
      const chunks = await engine.chat.completions.create(
        {
          messages: next,
          stream: true,
          temperature: 0.7,
        },
        { signal: controller.signal }
      );

      for await (const delta of chunks) {
        const token = delta.choices?.[0]?.delta?.content || "";
        if (token) {
          assistant = { ...assistant, content: assistant.content + token };
          setMessages((m) => {
            const copy = m.slice();
            copy[copy.length - 1] = assistant;
            return copy;
          });
        }
      }
      onResponse?.(assistant.content);
    } catch (e) {
      if (e.name !== "AbortError") console.error("AI error:", e);
    } finally {
      setStreaming(false);
    }
  };

  // Allow parent to trigger an automatic send with a composed prompt
  useEffect(() => {
    if (!prompt) return;
    if (!engine || streaming) return;
    if (autoSendKey === lastKeySentRef.current) return;
    const t = setTimeout(() => {
      lastKeySentRef.current = autoSendKey;
      send(prompt);
    }, 10);
    return () => clearTimeout(t);
    // Re-run when key or engine readiness changes
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [autoSendKey, engine]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!input.trim()) return;
    send(input.trim());
    setInput("");
  };

  return (
    <div className="rounded-2xl border border-slate-200 bg-white shadow-card flex flex-col">
      <div className="p-4 border-b border-slate-100">
        <div className="text-lg font-semibold">AI Assistant</div>
        <div className="text-xs text-slate-500">
          In-browser model (WebLLM). First load may take a minute.
        </div>
        {progress && (
          <div className="mt-1 text-[11px] text-slate-500">{progress}</div>
        )}
        {error && <div className="mt-2 text-xs text-red-600">{error}</div>}
      </div>
      <div className="p-4 space-y-3 max-h-[360px] overflow-auto">
        {messages
          .filter((m) => m.role !== "system")
          .map((m, idx) => (
            <div
              key={idx}
              className={`text-sm ${
                m.role === "user" ? "text-slate-800" : "text-slate-700"
              }`}
            >
              <div className="font-semibold mb-1">
                {m.role === "user" ? "You" : "Raahi"}
              </div>
              <div className="whitespace-pre-wrap leading-relaxed">
                {m.content}
              </div>
            </div>
          ))}
        {loadingModel && (
          <div className="text-xs text-slate-500">Loading AI model…</div>
        )}
      </div>
      <form
        onSubmit={handleSubmit}
        className="p-3 border-t border-slate-100 flex gap-2"
      >
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          className="flex-1 h-11 rounded-xl border border-slate-300 px-3"
          placeholder="Ask for a plan or travel advice…"
          disabled={!engine || loadingModel}
        />
        <button
          className="h-11 px-4 rounded-xl bg-[var(--brand)] text-white disabled:opacity-50"
          disabled={!engine || streaming || !!error}
        >
          Send
        </button>
        {streaming && (
          <button
            type="button"
            className="h-11 px-4 rounded-xl border border-slate-300 text-slate-700"
            onClick={() => abortRef.current?.abort?.()}
          >
            Stop
          </button>
        )}
      </form>
    </div>
  );
}
