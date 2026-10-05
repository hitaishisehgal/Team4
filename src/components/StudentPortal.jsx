import ConversationPanel from "./ConversationPanel";

function StudentPortal({
  student,
  intervention,
  onSendMessage,
  onRequestCheckIn,
  onLogout,
}) {
  const hasFacultyCheckIn = intervention?.action === "Faculty check-in";
  const messageHistory = intervention?.conversation ?? [];

  return (
    <main className="mx-auto min-h-[calc(100vh-150px)] max-w-[1040px] px-4 py-8 sm:px-6 lg:px-10">
      <div className="mb-7 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="section-kicker">Your space</p>
          <h1 className="mt-2 text-3xl font-bold tracking-tight text-slate-950 sm:text-4xl">
            Hi, {student.name} <span aria-hidden="true">👋</span>
          </h1>
          <p className="mt-2 text-sm text-slate-500">
            Your learning snapshot and a direct line to support.
          </p>
        </div>
        <button
          type="button"
          onClick={onLogout}
          className="min-h-10 self-start rounded-xl border border-slate-200 bg-white px-4 py-2 text-xs font-semibold text-slate-600 hover:border-slate-300 hover:text-slate-900"
        >
          Sign out
        </button>
      </div>

      <section className="student-welcome overflow-hidden rounded-2xl p-6 text-white sm:p-8">
        <span className="relative z-10 block text-xs font-semibold text-indigo-100">
          Your progress is a journey, not a score.
        </span>
        <h2 className="relative z-10 mt-2 max-w-xl text-xl font-bold sm:text-2xl">
          Keep taking things one step at a time.
        </h2>
        <p className="relative z-10 mt-2 max-w-2xl text-sm leading-6 text-indigo-100">
        This demo view shows only your own information. If you&apos;d
          like to talk about anything, your faculty team is here to listen.
        </p>
      </section>

      <section className="mt-5 grid gap-3 sm:grid-cols-3">
        <StudentMetric label="Attendance" value={`${student.attendance}%`} icon="◉" />
        <StudentMetric
          label="Assignments to catch up"
          value={student.missedAssignments}
          icon="✎"
        />
        <StudentMetric label="Current grade" value={`${student.currentGrade}%`} icon="↗" />
      </section>

      <section className="mt-5 grid gap-5 lg:grid-cols-[0.85fr_1.15fr]">
        <article className="panel-card p-5 sm:p-6">
          <p className="section-kicker">Support plan</p>
          {intervention ? (
            <>
              <h2 className="mt-2 text-lg font-bold text-slate-900">
                {intervention.status === "Completed"
                  ? "Your check-in is complete"
                  : "Your support is in motion"}
              </h2>
              <p className="mt-2 text-sm leading-6 text-slate-500">
                {intervention.action} · next review{" "}
                {formatDate(intervention.nextReview)}
              </p>
              {intervention.status === "Completed" && intervention.outcomeNote && (
                <p className="mt-3 rounded-xl bg-emerald-50 p-3 text-xs leading-5 text-emerald-800">
                  {intervention.outcomeNote}
                </p>
              )}
            </>
          ) : (
            <>
              <h2 className="mt-2 text-lg font-bold text-slate-900">
                Want to talk with someone?
              </h2>
              <p className="mt-2 text-sm leading-6 text-slate-500">
                Request a private faculty check-in. This opens a demo
                conversation so you can share what&apos;s on your mind.
              </p>
              <button
                type="button"
                onClick={() =>
                  onRequestCheckIn(
                    "Hi, I'd like to set up a time to talk with someone."
                  )
                }
                className="mt-4 min-h-11 rounded-xl bg-indigo-600 px-4 py-2.5 text-sm font-bold text-white hover:bg-indigo-700"
              >
                Request a check-in <span aria-hidden="true">→</span>
              </button>
            </>
          )}
        </article>

        {hasFacultyCheckIn ? (
          <ConversationPanel
            studentName={student.name}
            messages={messageHistory}
            senderRole="student"
            readOnly={intervention.status === "Completed"}
            onSendMessage={(text) => onSendMessage(student.id, text, "student")}
          />
        ) : (
          <article className="panel-card flex flex-col justify-center p-5 sm:p-6">
            <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-50 text-lg">
              💬
            </span>
            <h2 className="mt-3 text-base font-bold text-slate-900">
              Your conversation space
            </h2>
            <p className="mt-1 text-sm leading-6 text-slate-500">
              A private conversation panel will appear here when you or your
              faculty member starts a one-to-one check-in.
            </p>
          </article>
        )}
      </section>
      <p className="mt-5 text-center text-[11px] leading-5 text-slate-400">
        This is a demo support space. For urgent or personal concerns, please
        contact a trusted person or your campus support team directly.
      </p>
    </main>
  );
}

function StudentMetric({ label, value, icon }) {
  return (
    <article className="panel-card p-4">
      <div className="flex items-center justify-between">
        <p className="text-xs font-semibold text-slate-500">{label}</p>
        <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-indigo-50 text-indigo-700">
          {icon}
        </span>
      </div>
      <p className="mt-3 text-2xl font-bold tabular-nums text-slate-900">
        {value}
      </p>
    </article>
  );
}

function formatDate(date) {
  return new Intl.DateTimeFormat(undefined, {
    month: "short",
    day: "numeric",
    year: "numeric",
  }).format(new Date(date));
}

export default StudentPortal;
