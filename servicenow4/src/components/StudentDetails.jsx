import {
  calculateRiskScore,
  getRiskLevel,
  getRiskReasons,
} from "../utils/riskCalculator";
import ConversationPanel from "./ConversationPanel";
import RiskBadge from "./RiskBadge";

function StudentDetails({
  student,
  intervention,
  onBack,
  onTakeAction,
  onSendMessage,
  senderRole = "faculty",
}) {
  if (!student) {
    return (
      <main className="mx-auto max-w-4xl px-4 py-12 sm:px-6">
        <section className="panel-card px-6 py-12 text-center">
          <h1 className="text-lg font-bold text-slate-900">
            Student not found
          </h1>
          <button
            type="button"
            onClick={onBack}
            className="mt-5 rounded-xl bg-indigo-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-indigo-700"
          >
            Back to dashboard
          </button>
        </section>
      </main>
    );
  }

  const riskScore = calculateRiskScore(student);
  const riskLevel = getRiskLevel(riskScore);
  const reasons = getRiskReasons(student);
  const attendanceChange = student.attendance - student.previousAttendance;
  const gradeChange = student.currentGrade - student.previousGrade;
  const riskColors = {
    High: "text-rose-700",
    Medium: "text-amber-700",
    Low: "text-emerald-700",
  };

  return (
    <main className="mx-auto max-w-[1120px] px-4 pb-10 pt-6 sm:px-6 lg:px-10 lg:pt-9">
      <button
        type="button"
        onClick={onBack}
        className="mb-5 inline-flex min-h-9 items-center gap-2 rounded-lg text-sm font-semibold text-slate-500 transition hover:text-indigo-700 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-indigo-600"
      >
        <span aria-hidden="true">←</span> All students
      </button>

      <section className="panel-card overflow-hidden">
        <header className="detail-hero relative overflow-hidden p-6 sm:p-8 lg:p-10">
          <div className="relative z-10 flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-center gap-4 sm:gap-5">
              <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl border border-white/70 bg-white/80 text-2xl font-bold text-indigo-700 shadow-sm sm:h-[72px] sm:w-[72px]">
                {student.name.charAt(0).toUpperCase()}
              </div>
              <div>
                <p className="text-[11px] font-bold uppercase tracking-[0.16em] text-indigo-500">
                  Student snapshot · #{student.id}
                </p>
                <h1 className="mt-1 text-3xl font-bold tracking-tight text-slate-950 sm:text-4xl">
                  {student.name}
                </h1>
                <p className="mt-1 text-sm text-slate-500">
                  Academic engagement overview
                </p>
              </div>
            </div>

            <div className="flex items-center justify-between gap-5 rounded-2xl border border-white/80 bg-white/75 px-5 py-4 shadow-sm backdrop-blur sm:justify-start">
              <div>
                <p className="text-xs font-semibold text-slate-500">
                  Risk score
                </p>
                <p
                  className={`mt-0.5 text-3xl font-bold tabular-nums ${riskColors[riskLevel]}`}
                >
                  {riskScore}
                  <span className="ml-1 text-sm font-semibold text-slate-400">
                    / 100
                  </span>
                </p>
              </div>
              <div className="h-10 w-px bg-slate-200" />
              <div className="flex flex-col items-start gap-1">
                <span className="text-[10px] font-bold uppercase tracking-wide text-slate-400">
                  Current signal
                </span>
                <RiskBadge score={riskScore} />
              </div>
            </div>
          </div>
          <div aria-hidden="true" className="detail-orb" />
        </header>

        <div className="grid gap-4 p-5 sm:grid-cols-3 sm:p-7 lg:p-8">
          <MetricCard
            icon="◉"
            label="Attendance"
            current={`${student.attendance}%`}
            previous={`${student.previousAttendance}% previously`}
            change={formatPercentageChange(attendanceChange)}
            negative={attendanceChange < 0}
            previousValue={student.previousAttendance}
            currentValue={student.attendance}
            tone="indigo"
          />
          <MetricCard
            icon="✎"
            label="Missed assignments"
            current={student.missedAssignments}
            previous="This academic period"
            change={
              student.missedAssignments > 0
                ? "Opportunity to catch up"
                : "All caught up"
            }
            negative={student.missedAssignments >= 3}
            tone="amber"
          />
          <MetricCard
            icon="↗"
            label="Current grade"
            current={`${student.currentGrade}%`}
            previous={`${student.previousGrade}% previously`}
            change={formatPercentageChange(gradeChange)}
            negative={gradeChange < 0}
            previousValue={student.previousGrade}
            currentValue={student.currentGrade}
            tone="violet"
          />
        </div>

        <div className="grid gap-0 border-t border-slate-100 lg:grid-cols-[1.15fr_0.85fr]">
          <section className="px-6 py-7 sm:px-8 sm:py-8">
            <div className="flex items-start gap-3">
              <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-rose-50 text-lg text-rose-600">
                ✦
              </span>
              <div>
                <p className="section-kicker">Signals, not labels</p>
                <h2 className="mt-1 text-lg font-bold text-slate-900">
                  Why might {student.name} need a check-in?
                </h2>
              </div>
            </div>
            {reasons.length > 0 ? (
              <ul className="mt-6 space-y-3">
                {reasons.map((reason) => (
                  <li
                    key={reason}
                    className="flex items-start gap-3 rounded-xl border border-slate-100 bg-slate-50/80 px-4 py-3 text-sm leading-5 text-slate-700"
                  >
                    <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-emerald-100 text-xs font-bold text-emerald-700">
                      ✓
                    </span>
                    {reason}
                  </li>
                ))}
              </ul>
            ) : (
              <p className="mt-6 rounded-xl bg-emerald-50 px-4 py-4 text-sm text-emerald-800">
                No immediate academic engagement signals. Keep offering regular
                encouragement and support.
              </p>
            )}
            <p className="mt-4 text-xs leading-5 text-slate-400">
              These indicators are prompts for a human conversation, not a
              diagnosis or a complete picture of the student.
            </p>
          </section>

          <aside className="border-t border-slate-100 bg-slate-50/60 px-6 py-7 sm:px-8 sm:py-8 lg:border-l lg:border-t-0">
            {intervention ? (
              <div>
                <div className="flex items-center gap-2">
                  <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-100 text-emerald-700">
                    ✓
                  </span>
                  <p className="text-sm font-bold text-emerald-800">
                    Intervention created
                  </p>
                </div>
                <h2 className="mt-4 text-lg font-bold text-slate-900">
                  Support is in motion
                </h2>
                <div className="mt-4 space-y-3 rounded-xl border border-slate-200 bg-white p-4">
                  <DetailLine label="Action" value={intervention.action} />
                  <DetailLine
                    label="Priority"
                    value={intervention.priority}
                    emphasize={intervention.priority === "High"}
                  />
                  <DetailLine
                    label="Status"
                    value={
                      intervention.status === "In progress"
                        ? "Intervention in progress"
                        : intervention.status
                    }
                  />
                  <DetailLine
                    label="Next review"
                    value={formatDate(intervention.nextReview)}
                  />
                </div>
                {intervention.outcomeNote && (
                  <p className="mt-4 rounded-xl bg-emerald-50 p-3 text-xs leading-5 text-emerald-800">
                    <span className="font-bold">Outcome: </span>
                    {intervention.outcomeNote}
                  </p>
                )}
                {intervention.status === "In progress" && (
                  <button
                    type="button"
                    onClick={onTakeAction}
                    className="mt-5 inline-flex min-h-11 w-full items-center justify-center gap-2 rounded-xl border border-indigo-200 bg-white px-5 py-3 text-sm font-bold text-indigo-700 shadow-sm transition hover:bg-indigo-50 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                  >
                    Update follow-up <span aria-hidden="true">↗</span>
                  </button>
                )}
              </div>
            ) : (
              <div>
                <p className="section-kicker">A thoughtful next step</p>
                <h2 className="mt-1 text-lg font-bold text-slate-900">
                  Recommended action
                </h2>
                <p className="mt-3 text-sm leading-6 text-slate-600">
                  A friendly faculty check-in within 48 hours can help
                  understand what support would be most useful.
                </p>
                <div className="mt-4 flex items-start gap-3 rounded-xl border border-indigo-100 bg-indigo-50/80 p-4">
                  <span className="text-lg" aria-hidden="true">
                    💬
                  </span>
                  <p className="text-xs leading-5 text-indigo-900">
                    Start with curiosity. Ask how things are going before
                    suggesting next steps.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={onTakeAction}
                  className="mt-5 inline-flex min-h-12 w-full items-center justify-center gap-2 rounded-xl bg-indigo-600 px-5 py-3 text-sm font-bold text-white shadow-lg shadow-indigo-600/20 transition hover:-translate-y-0.5 hover:bg-indigo-700 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                >
                  Take Action <span aria-hidden="true">→</span>
                </button>
              </div>
            )}
          </aside>
        </div>
        {intervention?.action === "Faculty check-in" && (
          <section className="border-t border-slate-100 px-6 py-7 sm:px-8 sm:py-8">
            <div className="mx-auto max-w-2xl">
              <ConversationPanel
                studentName={student.name}
                messages={intervention.conversation ?? []}
                senderRole="staff"
                readOnly={intervention.status === "Completed"}
                onSendMessage={(text) =>
                  onSendMessage(student.id, text, senderRole)
                }
              />
            </div>
          </section>
        )}
      </section>
    </main>
  );
}

function MetricCard({
  icon,
  label,
  current,
  previous,
  change,
  negative,
  previousValue,
  currentValue,
  tone,
}) {
  const tones = {
    indigo: "bg-indigo-50 text-indigo-700",
    amber: "bg-amber-50 text-amber-700",
    violet: "bg-violet-50 text-violet-700",
  };
  const chartValues = [previousValue, currentValue].filter(
    (value) => Number.isFinite(value)
  );
  const maxValue = Math.max(...chartValues, 1);

  return (
    <article className="rounded-2xl border border-slate-200 bg-white p-5 transition hover:border-slate-300 hover:shadow-md hover:shadow-slate-200/50">
      <div className="flex items-center justify-between">
        <p className="text-xs font-bold uppercase tracking-wide text-slate-500">
          {label}
        </p>
        <span
          className={`flex h-8 w-8 items-center justify-center rounded-lg text-sm font-bold ${tones[tone]}`}
        >
          {icon}
        </span>
      </div>
      <p className="mt-4 text-3xl font-bold tracking-tight text-slate-950 tabular-nums">
        {current}
        {label === "Missed assignments" && (
          <span className="ml-1.5 text-sm font-semibold text-slate-500">
            missed
          </span>
        )}
      </p>
      <p className="mt-1 text-xs text-slate-400">{previous}</p>
      {chartValues.length === 2 ? (
        <div className="mt-4 space-y-2">
          <CompareBar
            label="Previous"
            value={previousValue}
            maxValue={maxValue}
          />
          <CompareBar
            label="Current"
            value={currentValue}
            maxValue={maxValue}
            current
          />
        </div>
      ) : (
        <div className="mt-4 h-[34px]">
          <div className="h-1.5 overflow-hidden rounded-full bg-slate-100">
            <div
              className={`h-full rounded-full ${
                negative ? "bg-amber-400" : "bg-emerald-400"
              }`}
              style={{
                width: `${Math.min(
                  100,
                  Math.max(10, Number(current) * 12)
                )}%`,
              }}
            />
          </div>
        </div>
      )}
      <p
        className={`mt-2 text-xs font-semibold ${
          negative ? "text-rose-600" : "text-emerald-700"
        }`}
      >
        {change}
      </p>
    </article>
  );
}

function CompareBar({ label, value, maxValue, current = false }) {
  return (
    <div className="flex items-center gap-2.5">
      <span className="w-[58px] text-[10px] font-medium text-slate-400">
        {label}
      </span>
      <div
        className="h-1.5 flex-1 overflow-hidden rounded-full bg-slate-100"
        role="img"
        aria-label={`${label} value ${value}%`}
      >
        <div
          className={`h-full rounded-full ${
            current ? "bg-indigo-500" : "bg-slate-300"
          }`}
          style={{ width: `${(value / maxValue) * 100}%` }}
        />
      </div>
      <span className="w-8 text-right text-[10px] font-bold tabular-nums text-slate-600">
        {value}%
      </span>
    </div>
  );
}

function DetailLine({ label, value, emphasize = false }) {
  return (
    <div className="flex items-start justify-between gap-4 text-sm">
      <span className="text-slate-500">{label}</span>
      <span
        className={`text-right font-semibold ${
          emphasize ? "text-rose-700" : "text-slate-800"
        }`}
      >
        {value}
      </span>
    </div>
  );
}

function formatPercentageChange(change) {
  if (change === 0) return "No change";
  const arrow = change < 0 ? "↓" : "↑";
  return `${arrow} ${Math.abs(change)} percentage points`;
}

function formatDate(date) {
  return new Intl.DateTimeFormat(undefined, {
    month: "short",
    day: "numeric",
    year: "numeric",
  }).format(new Date(date));
}

export default StudentDetails;
