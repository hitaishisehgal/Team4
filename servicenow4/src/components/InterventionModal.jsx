import { useEffect, useState } from "react";
import {
  calculateRiskScore,
  getRiskLevel,
  getRiskReasons,
} from "../utils/riskCalculator";

const actions = [
  {
    value: "Faculty check-in",
    description: "A supportive one-to-one conversation",
    icon: "💬",
  },
  {
    value: "Academic advisor",
    description: "Connect with academic planning support",
    icon: "🧭",
  },
  {
    value: "Student support",
    description: "Explore campus support services together",
    icon: "🌱",
  },
];

function InterventionModal({
  student,
  existingIntervention,
  role = "faculty",
  onClose,
  onConfirm,
}) {
  const [action, setAction] = useState(
    existingIntervention?.action ??
      (role === "advisor" ? actions[1].value : actions[0].value)
  );
  const availableActions =
    role === "advisor"
      ? actions.filter(
          (item) =>
            item.value !== "Faculty check-in" ||
            item.value === existingIntervention?.action
        )
      : actions;
  const score = calculateRiskScore(student);
  const priority = getRiskLevel(score);
  const reasons = getRiskReasons(student);

  useEffect(() => {
    const handleKeyDown = (event) => {
      if (event.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [onClose]);

  const handleSubmit = (event) => {
    event.preventDefault();
    onConfirm(
      createInterventionRecord(
        student,
        action,
        priority,
        reasons,
        existingIntervention,
        role
      )
    );
  };

  return (
    <div
      className="modal-backdrop fixed inset-0 z-50 flex items-end justify-center overflow-y-auto p-0 sm:items-center sm:p-5"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) onClose();
      }}
    >
      <section
        role="dialog"
        aria-modal="true"
        aria-labelledby="intervention-title"
        className="modal-panel w-full max-w-xl overflow-hidden rounded-t-3xl bg-white shadow-2xl sm:rounded-3xl"
      >
        <header className="border-b border-slate-100 px-6 pb-5 pt-6 sm:px-7">
          <div className="flex items-start justify-between gap-4">
            <div>
              <span className="section-kicker">A little support goes a long way</span>
              <h2
                id="intervention-title"
                className="mt-1 text-xl font-bold tracking-tight text-slate-950"
              >
                {existingIntervention
                  ? "Update follow-up"
                  : "Create an intervention"}
              </h2>
              <p className="mt-1 text-sm text-slate-500">
                Choose a thoughtful next step for {student.name}.
              </p>
            </div>
            <button
              type="button"
              onClick={onClose}
              aria-label="Close intervention dialog"
              className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl text-lg text-slate-400 transition hover:bg-slate-100 hover:text-slate-700"
            >
              ×
            </button>
          </div>
        </header>

        <form onSubmit={handleSubmit}>
          <div className="max-h-[min(65vh,560px)] space-y-5 overflow-y-auto px-6 py-5 sm:px-7">
            <div className="rounded-2xl border border-indigo-100 bg-indigo-50/70 p-4">
              <div className="flex items-center justify-between gap-3">
                <div>
                  <p className="text-xs font-semibold text-indigo-900">
                    {student.name} · Student #{student.id}
                  </p>
                  <p className="mt-1 text-xs text-indigo-700">
                    {score}/100 academic engagement signal
                  </p>
                </div>
                <span
                  className={`rounded-full px-3 py-1 text-[10px] font-bold uppercase tracking-wide ${
                    priority === "High"
                      ? "bg-rose-100 text-rose-700"
                      : priority === "Medium"
                        ? "bg-amber-100 text-amber-700"
                        : "bg-emerald-100 text-emerald-700"
                  }`}
                >
                  {priority} priority
                </span>
              </div>
              {reasons.length > 0 && (
                <p className="mt-3 border-t border-indigo-100 pt-3 text-xs leading-5 text-indigo-800">
                  {reasons.join(" · ")}
                </p>
              )}
            </div>

            <fieldset>
              <legend className="mb-3 text-sm font-bold text-slate-900">
                Select a support action
              </legend>
              <div className="space-y-2">
                {availableActions.map((option) => (
                  <label
                    key={option.value}
                    className={`flex cursor-pointer items-center gap-3 rounded-xl border p-3.5 transition ${
                      action === option.value
                        ? "border-indigo-300 bg-indigo-50/70 ring-2 ring-indigo-100"
                        : "border-slate-200 bg-white hover:border-slate-300"
                    }`}
                  >
                    <input
                      type="radio"
                      name="intervention-action"
                      value={option.value}
                      checked={action === option.value}
                      onChange={() => setAction(option.value)}
                      className="h-4 w-4 accent-indigo-600"
                    />
                    <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-white text-lg shadow-sm">
                      {option.icon}
                    </span>
                    <span>
                      <span className="block text-sm font-semibold text-slate-800">
                        {option.value}
                      </span>
                      <span className="mt-0.5 block text-xs text-slate-500">
                        {option.description}
                      </span>
                    </span>
                  </label>
                ))}
              </div>
            </fieldset>

            <div className="flex items-start gap-3 rounded-xl bg-slate-50 p-3.5">
              <span aria-hidden="true" className="text-base">
                📅
              </span>
              <p className="text-xs leading-5 text-slate-600">
                This creates a local demo follow-up and sets the next review for
                7 days from today. No message is sent to the student.
              </p>
            </div>
          </div>

          <footer className="flex flex-col-reverse gap-2 border-t border-slate-100 bg-slate-50/70 px-6 py-4 sm:flex-row sm:justify-end sm:px-7">
            <button
              type="button"
              onClick={onClose}
              className="min-h-11 rounded-xl px-4 py-2.5 text-sm font-semibold text-slate-600 transition hover:bg-slate-100"
            >
              Not now
            </button>
            <button
              type="submit"
              className="min-h-11 rounded-xl bg-indigo-600 px-5 py-2.5 text-sm font-bold text-white shadow-sm transition hover:bg-indigo-700 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
            >
              {existingIntervention ? "Save follow-up" : "Confirm intervention"}
            </button>
          </footer>
        </form>
      </section>
    </div>
  );
}

function createInterventionRecord(
  student,
  action,
  priority,
  reasons,
  existing,
  role
) {
  const nextReview = new Date();
  nextReview.setDate(nextReview.getDate() + 7);
  nextReview.setHours(12, 0, 0, 0);
  const createdAt = new Date().toISOString();
  const conversation =
    action === "Faculty check-in"
      ? existing?.conversation?.length
        ? existing.conversation
        : [
            {
              senderRole: role === "advisor" ? "advisor" : "faculty",
              text: `Hi ${student.name}, I wanted to check in and see how things are going. Is there anything you'd like to talk about or support that would be helpful?`,
              sentAt: createdAt,
            },
          ]
      : existing?.conversation ?? [];

  return {
    studentId: student.id,
    action,
    priority,
    reason:
      reasons.length > 0
        ? reasons.join(" · ")
        : "Routine academic engagement check-in",
    status: "In progress",
    nextReview: nextReview.toISOString(),
    createdAt: existing?.createdAt ?? createdAt,
    conversation,
  };
}

export default InterventionModal;
