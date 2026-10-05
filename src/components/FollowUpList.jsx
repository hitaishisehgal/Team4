import { useState } from "react";

function FollowUpList({
  interventions,
  students,
  onOpenStudent,
  onCloseFollowUp,
  onBack,
  role,
}) {
  const [filter, setFilter] = useState("In progress");
  const [notes, setNotes] = useState({});
  const visibleItems = interventions
    .filter((item) => filter === "All" || item.status === filter)
    .sort((a, b) => new Date(a.nextReview) - new Date(b.nextReview));

  return (
    <main className="mx-auto min-h-[calc(100vh-160px)] max-w-[1440px] px-4 py-8 sm:px-6 lg:px-10 lg:py-10">
      <div className="mb-7 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="section-kicker">Stay connected</p>
          <h1 className="mt-2 text-3xl font-bold tracking-tight text-slate-950 sm:text-4xl">
            {role === "advisor" ? "Support follow-ups" : "Follow-ups"}
          </h1>
          <p className="mt-2 max-w-xl text-sm leading-6 text-slate-500">
            Track actions in progress and close the loop with a short outcome
            note when support is complete.
          </p>
        </div>
        <button
          type="button"
          onClick={onBack}
          className="min-h-11 self-start rounded-xl bg-indigo-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-indigo-700"
        >
          ← Back to workspace
        </button>
      </div>

      <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
        <div className="flex gap-2" role="group" aria-label="Filter follow-ups">
          {["In progress", "Completed", "All"].map((status) => (
            <button
              key={status}
              type="button"
              onClick={() => setFilter(status)}
              aria-pressed={filter === status}
              className={`rounded-full px-3.5 py-2 text-xs font-semibold transition ${
                filter === status
                  ? "bg-slate-900 text-white"
                  : "border border-slate-200 bg-white text-slate-500 hover:text-slate-800"
              }`}
            >
              {status}
            </button>
          ))}
        </div>
        <p className="text-xs text-slate-400">
          {visibleItems.length} {visibleItems.length === 1 ? "case" : "cases"}
        </p>
      </div>

      {visibleItems.length === 0 ? (
        <div className="panel-card flex flex-col items-center px-6 py-16 text-center">
          <span className="flex h-16 w-16 items-center justify-center rounded-3xl bg-indigo-50 text-3xl">
            {filter === "Completed" ? "🎉" : "🌱"}
          </span>
          <h2 className="mt-5 text-lg font-bold text-slate-900">
            {filter === "Completed"
              ? "No completed follow-ups yet"
              : "Nothing needs follow-up right now"}
          </h2>
          <p className="mt-2 max-w-md text-sm leading-6 text-slate-500">
            When a support action is created from a student case, it will
            appear here.
          </p>
        </div>
      ) : (
        <section className="grid gap-4 lg:grid-cols-2">
          {visibleItems.map((item) => {
            const student = students.find(
              (entry) => entry.id === item.studentId
            );
            if (!student) return null;

            return (
              <article key={item.studentId} className="panel-card p-5 sm:p-6">
                <div className="flex flex-wrap items-start justify-between gap-4">
                  <button
                    type="button"
                    onClick={() => onOpenStudent(student.id)}
                    className="flex items-center gap-3 rounded-lg text-left focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-indigo-600"
                  >
                    <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-indigo-50 font-bold text-indigo-700">
                      {student.name.charAt(0)}
                    </span>
                    <span>
                      <span className="block font-bold text-slate-900">
                        {student.name}
                      </span>
                      <span className="mt-0.5 block text-xs text-slate-500">
                        {item.action}
                      </span>
                    </span>
                  </button>
                  <span
                    className={`rounded-full px-3 py-1 text-[11px] font-bold ${
                      item.status === "Completed"
                        ? "bg-emerald-50 text-emerald-700"
                        : "bg-amber-50 text-amber-700"
                    }`}
                  >
                    {item.status === "In progress"
                      ? "Intervention in progress"
                      : item.status}
                  </span>
                </div>

                <div className="mt-5 grid grid-cols-2 gap-3 rounded-xl bg-slate-50 p-4">
                  <FollowUpDatum label="Priority" value={item.priority} />
                  <FollowUpDatum
                    label={item.status === "Completed" ? "Completed" : "Next review"}
                    value={
                      item.status === "Completed"
                        ? formatDate(item.completedAt)
                        : formatDate(item.nextReview)
                    }
                  />
                </div>

                {item.status === "Completed" ? (
                  <p className="mt-4 rounded-xl border border-emerald-100 bg-emerald-50/70 p-3 text-xs leading-5 text-emerald-800">
                    <span className="font-bold">Outcome: </span>
                    {item.outcomeNote || "Completed; no outcome note added."}
                  </p>
                ) : (
                  <div className="mt-4">
                    <label
                      htmlFor={`close-note-${item.studentId}`}
                      className="mb-1.5 block text-xs font-semibold text-slate-600"
                    >
                      Outcome note <span className="font-normal text-slate-400">(optional)</span>
                    </label>
                    <textarea
                      id={`close-note-${item.studentId}`}
                      value={notes[item.studentId] ?? ""}
                      onChange={(event) =>
                        setNotes((current) => ({
                          ...current,
                          [item.studentId]: event.target.value,
                        }))
                      }
                      maxLength={280}
                      rows={2}
                      placeholder="What happened or what support was agreed?"
                      className="w-full resize-y rounded-xl border border-slate-200 px-3 py-2.5 text-xs leading-5 outline-none focus:border-indigo-400 focus:ring-4 focus:ring-indigo-100"
                    />
                    <div className="mt-3 flex flex-wrap items-center justify-between gap-3">
                      <button
                        type="button"
                        onClick={() => onOpenStudent(student.id)}
                        className="text-xs font-semibold text-indigo-700 hover:text-indigo-900"
                      >
                        Open case & conversation →
                      </button>
                      <button
                        type="button"
                        onClick={() =>
                          onCloseFollowUp(
                            student.id,
                            (notes[student.id] ?? "").trim()
                          )
                        }
                        className="min-h-9 rounded-lg bg-emerald-600 px-3.5 py-2 text-xs font-bold text-white transition hover:bg-emerald-700"
                      >
                        ✓ Mark complete
                      </button>
                    </div>
                  </div>
                )}
              </article>
            );
          })}
        </section>
      )}
    </main>
  );
}

function FollowUpDatum({ label, value }) {
  return (
    <div>
      <p className="text-[10px] font-semibold uppercase tracking-wide text-slate-400">
        {label}
      </p>
      <p className="mt-1 text-sm font-semibold text-slate-800">{value}</p>
    </div>
  );
}

function formatDate(date) {
  return new Intl.DateTimeFormat(undefined, {
    month: "short",
    day: "numeric",
    year: "numeric",
  }).format(new Date(date));
}

export default FollowUpList;
