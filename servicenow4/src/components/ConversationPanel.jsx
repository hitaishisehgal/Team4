import { useState } from "react";

function ConversationPanel({
  studentName,
  messages = [],
  senderRole,
  readOnly = false,
  onSendMessage,
}) {
  const [message, setMessage] = useState("");

  const submit = (event) => {
    event.preventDefault();
    const content = message.trim();
    if (!content || readOnly) return;
    onSendMessage(content);
    setMessage("");
  };

  return (
    <section className="overflow-hidden rounded-2xl border border-indigo-100 bg-white">
      <header className="flex items-center gap-3 border-b border-indigo-100 bg-indigo-50/70 px-4 py-3.5">
        <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-white text-lg shadow-sm">
          💬
        </span>
        <div>
          <h3 className="text-sm font-bold text-slate-900">
            1-on-1 check-in
          </h3>
          <p className="text-[11px] text-slate-500">
            Demo conversation with {studentName}
          </p>
        </div>
        <span className="ml-auto rounded-full bg-emerald-100 px-2.5 py-1 text-[10px] font-bold text-emerald-700">
          {readOnly ? "Closed" : "Open"}
        </span>
      </header>

      <div
        aria-live="polite"
        className="conversation-scroll max-h-72 min-h-32 space-y-3 overflow-y-auto bg-slate-50/50 p-4"
      >
        {messages.length === 0 ? (
          <p className="py-5 text-center text-xs text-slate-400">
            No messages yet. Start with a warm, open question.
          </p>
        ) : (
          messages.map((entry, index) => {
            const isSelf = entry.senderRole === senderRole;
            const sender =
              entry.senderRole === "student"
                ? studentName
                : entry.senderRole === "advisor"
                  ? "Academic advisor"
                  : "Faculty";
            return (
              <div
                key={`${entry.sentAt}-${index}`}
                className={`flex ${isSelf ? "justify-end" : "justify-start"}`}
              >
                <div
                  className={`max-w-[88%] rounded-2xl px-3.5 py-2.5 ${
                    isSelf
                      ? "rounded-br-md bg-indigo-600 text-white"
                      : "rounded-bl-md border border-slate-200 bg-white text-slate-700"
                  }`}
                >
                  <p
                    className={`mb-1 text-[10px] font-bold ${
                      isSelf ? "text-indigo-100" : "text-slate-400"
                    }`}
                  >
                    {sender}
                  </p>
                  <p className="whitespace-pre-wrap break-words text-xs leading-5">
                    {entry.text}
                  </p>
                  {entry.sentAt && (
                    <time
                      dateTime={entry.sentAt}
                      className={`mt-1 block text-right text-[9px] ${
                        isSelf ? "text-indigo-200" : "text-slate-400"
                      }`}
                    >
                      {new Intl.DateTimeFormat(undefined, {
                        hour: "numeric",
                        minute: "2-digit",
                      }).format(new Date(entry.sentAt))}
                    </time>
                  )}
                </div>
              </div>
            );
          })
        )}
      </div>

      {readOnly ? (
        <p className="border-t border-slate-100 px-4 py-3 text-center text-xs text-slate-400">
          This follow-up is closed. The conversation remains available to review.
        </p>
      ) : (
        <form onSubmit={submit} className="flex gap-2 border-t border-slate-100 p-3">
          <label className="sr-only" htmlFor="conversation-message">
            Message
          </label>
          <input
            id="conversation-message"
            value={message}
            onChange={(event) => setMessage(event.target.value)}
            maxLength={500}
            placeholder="Write a supportive message..."
            className="min-h-10 min-w-0 flex-1 rounded-xl border border-slate-200 px-3 text-xs outline-none focus:border-indigo-400 focus:ring-4 focus:ring-indigo-100"
          />
          <button
            type="submit"
            disabled={!message.trim()}
            className="min-h-10 rounded-xl bg-indigo-600 px-3.5 text-xs font-bold text-white transition hover:bg-indigo-700 disabled:cursor-not-allowed disabled:opacity-40"
          >
            Send
          </button>
        </form>
      )}
      <p className="border-t border-slate-100 px-4 py-2 text-[10px] text-slate-400">
        Demo only. Messages are stored locally in this browser, not delivered.
      </p>
    </section>
  );
}

export default ConversationPanel;
