
import { useRef, useState } from "react";
import API_URL from "../api.js";

const suggestions = [
  "Explain Java OOP concepts with examples",
  "Teach me DBMS normalization",
  "Explain OSI model in simple language",
  "Help me solve a mathematics problem",
];

function AIAssistant() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const bottomRef = useRef(null);

  const sendMessage = async (text = input) => {
    const question = text.trim();
    if (!question || loading) return;

    const token = localStorage.getItem("token");

    if (!token) {
      setError("Your session has expired. Please log in again.");
      return;
    }

    const previousMessages = messages;
    const nextMessages = [
      ...previousMessages,
      { role: "user", text: question },
    ];

    setMessages(nextMessages);
    setInput("");
    setError("");
    setLoading(true);

    try {
      const history = previousMessages.slice(-10).map((message) => ({
        role: message.role === "assistant" ? "model" : "user",
        text: message.text,
      }));

      const response = await fetch(`${API_URL}/api/ai`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ message: question, history }),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || "Unable to get an AI response.");
      }

      setMessages((current) => [
        ...current,
        { role: "assistant", text: result.answer },
      ]);
    } catch (err) {
      setError(
        err.message ||
          "Could not connect to AI. Check your internet and try again.",
      );
    } finally {
      setLoading(false);
      setTimeout(() => bottomRef.current?.scrollIntoView({ behavior: "smooth" }), 50);
    }
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    sendMessage();
  };

  return (
    <section className="mx-auto max-w-5xl">
      <div className="mb-7 flex flex-wrap items-center justify-between gap-4">
        <div>
          <p className="mb-2 text-xs font-bold uppercase tracking-[0.2em] text-indigo-500">
            Your personal learning companion
          </p>
          <h1 className="text-3xl font-extrabold text-slate-800">
            AI Study Assistant
          </h1>
          <p className="mt-2 text-sm text-slate-500">
            Ask questions, understand concepts, and learn step by step.
          </p>
        </div>
        <div className="flex items-center gap-2 rounded-full border border-emerald-100 bg-emerald-50 px-4 py-2 text-sm font-semibold text-emerald-700">
          <span className="h-2 w-2 rounded-full bg-emerald-500" />
          StudyMate AI
        </div>
      </div>

      <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
        <div className="border-b border-slate-100 bg-slate-50 px-5 py-4">
          <p className="font-bold text-slate-800">Study chat</p>
          <p className="mt-1 text-xs text-slate-500">
            Ask in English or Gujarati.
          </p>
        </div>

        <div
          className="flex min-h-[340px] max-h-[55vh] flex-col gap-4 overflow-y-auto p-5 sm:p-6"
          aria-live="polite"
        >
          {messages.length === 0 && (
            <div className="m-auto max-w-xl py-6 text-center">
              <div className="mx-auto mb-4 grid h-14 w-14 place-items-center rounded-2xl bg-indigo-50 text-2xl">
                ✨
              </div>
              <h2 className="text-xl font-bold text-slate-800">
                What would you like to learn?
              </h2>
              <p className="mt-2 text-sm text-slate-500">
                Choose a topic or type your own question below.
              </p>
              <div className="mt-6 grid gap-3 sm:grid-cols-2">
                {suggestions.map((suggestion) => (
                  <button
                    key={suggestion}
                    type="button"
                    onClick={() => sendMessage(suggestion)}
                    disabled={loading}
                    className="rounded-xl border border-slate-200 p-3 text-left text-sm text-slate-600 transition hover:border-indigo-300 hover:bg-indigo-50 disabled:opacity-50"
                  >
                    {suggestion}
                  </button>
                ))}
              </div>
            </div>
          )}

          {messages.map((message, index) => (
            <div
              key={`${index}-${message.role}`}
              className={`flex ${message.role === "user" ? "justify-end" : "justify-start"}`}
            >
              <div
                className={`max-w-[90%] whitespace-pre-wrap break-words rounded-2xl px-4 py-3 text-sm leading-7 sm:max-w-[80%] ${
                  message.role === "user"
                    ? "rounded-br-md bg-indigo-600 text-white"
                    : "rounded-bl-md border border-slate-100 bg-slate-50 text-slate-700"
                }`}
              >
                {message.text}
              </div>
            </div>
          ))}

          {loading && (
            <div className="self-start rounded-xl bg-slate-100 px-4 py-3 text-sm text-slate-500">
              StudyMate AI is thinking...
            </div>
          )}

          <div ref={bottomRef} />
        </div>

        {error && (
          <div
            role="alert"
            className="mx-5 mb-3 rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-700"
          >
            {error}
          </div>
        )}

        <form
          onSubmit={handleSubmit}
          className="flex items-end gap-3 border-t border-slate-100 bg-white p-4 sm:p-5"
        >
          <textarea
            value={input}
            onChange={(event) => setInput(event.target.value)}
            onKeyDown={(event) => {
              if (event.key === "Enter" && !event.shiftKey) {
                event.preventDefault();
                handleSubmit(event);
              }
            }}
            placeholder="Ask a question... (Enter to send)"
            aria-label="Your question"
            rows={2}
            maxLength={2000}
            disabled={loading}
            className="min-h-[52px] flex-1 resize-y rounded-xl border border-slate-200 px-4 py-3 text-sm"
          />
          <button
            type="submit"
            disabled={loading || !input.trim()}
            className="rounded-xl bg-indigo-600 px-5 py-3 font-semibold text-white hover:bg-indigo-700 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {loading ? "Thinking..." : "Send ↗"}
          </button>
        </form>
        <p className="px-5 pb-4 text-xs text-slate-400">
          AI responses can contain mistakes. Verify important information.
        </p>
      </div>
    </section>
  );
}

export default AIAssistant;
