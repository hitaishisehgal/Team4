import { calculateRiskScore, getRiskLevel } from "../utils/riskCalculator";
import RiskBadge from "./RiskBadge";

function AdvisorDesk({ students, interventions, onOpenStudent, onViewFollowUps }) {
  const caseload = [...students]
    .map((student) => ({
      ...student,
      riskScore: calculateRiskScore(student),
      riskLevel: getRiskLevel(calculateRiskScore(student)),
      intervention: interventions[student.id],
    }))
    .sort((a, b) => {
      const activeA = a.intervention?.status === "In progress" ? 1 : 0;
      const activeB = b.intervention?.status === "In progress" ? 1 : 0;
      return activeB - activeA || b.riskScore - a.riskScore;
    });
  const activeCases = Object.values(interventions).filter(
    (intervention) => intervention.status === "In progress"
  ).length;

  return (
    <main className="mx-auto min-h-[calc(100vh-150px)] max-w-[1440px] px-4 py-8 sm:px-6 lg:px-10 lg:py-10">
      <div className="mb-7 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="section-kicker">Advisor workspace</p>
          <h1 className="mt-2 text-3xl font-bold tracking-tight text-slate-950 sm:text-4xl">
            Support casework
          </h1>
          <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-500">
            Review student support needs, coordinate academic advising, and
            keep active follow-ups moving.
          </p>
        </div>
        <button
          type="button"
          onClick={onViewFollowUps}
          className="min-h-11 self-start rounded-xl bg-indigo-600 px-4 py-2.5 text-sm font-bold text-white shadow-sm hover:bg-indigo-700"
        >
          Open follow-ups <span aria-hidden="true">→</span>
        </button>
      </div>

      <section className="grid gap-3 sm:grid-cols-3">
        <AdvisorStat label="Students in view" value={students.length} icon="◎" />
        <AdvisorStat label="Active support cases" value={activeCases} icon="↗" />
        <AdvisorStat
          label="Unassigned signals"
          value={
            students.filter(
              (student) =>
                calculateRiskScore(student) >= 40 &&
                interventions[student.id]?.status !== "In progress"
            ).length
          }
          icon="◷"
        />
      </section>

      <section className="mt-8">
        <div className="mb-4">
          <p className="section-kicker">Academic support</p>
          <h2 className="mt-1 text-lg font-bold text-slate-900">
            Students to review
          </h2>
        </div>
        <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
          {caseload.map((student) => (
            <article
              key={student.id}
              className="panel-card p-5 transition hover:-translate-y-0.5 hover:shadow-lg hover:shadow-slate-200/60"
            >
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-center gap-3">
                  <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-50 font-bold text-indigo-700">
                    {student.name.charAt(0)}
                  </span>
                  <div>
                    <h3 className="text-sm font-bold text-slate-900">
                      {student.name}
                    </h3>
                    <p className="text-[11px] text-slate-400">
                      Student #{student.id}
                    </p>
                  </div>
                </div>
                <RiskBadge score={student.riskScore} />
              </div>
              <div className="mt-4 grid grid-cols-3 gap-2 rounded-xl bg-slate-50 p-3">
                <TinyStat label="Attendance" value={`${student.attendance}%`} />
                <TinyStat
                  label="Missed work"
                  value={student.missedAssignments}
                />
                <TinyStat
                  label="Grade change"
                  value={`${student.currentGrade - student.previousGrade > 0 ? "+" : ""}${student.currentGrade - student.previousGrade}`}
                />
              </div>
              <div className="mt-4 flex items-center justify-between gap-2">
                {student.intervention?.status === "In progress" ? (
                  <span className="text-[11px] font-semibold text-amber-700">
                    ● {student.intervention.action}
                  </span>
                ) : (
                  <span className="text-[11px] text-slate-400">
                    {student.riskLevel === "Low"
                      ? "No active support case"
                      : "Review may be helpful"}
                  </span>
                )}
                <button
                  type="button"
                  onClick={() => onOpenStudent(student)}
                  className="min-h-9 rounded-lg px-2.5 text-xs font-bold text-indigo-700 hover:bg-indigo-50"
                >
                  Open case →
                </button>
              </div>
            </article>
          ))}
        </div>
      </section>
    </main>
  );
}

function AdvisorStat({ label, value, icon }) {
  return (
    <article className="panel-card flex items-center justify-between p-5">
      <div>
        <p className="text-xs font-semibold text-slate-500">{label}</p>
        <p className="mt-2 text-2xl font-bold text-slate-900">{value}</p>
      </div>
      <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-50 text-lg text-indigo-700">
        {icon}
      </span>
    </article>
  );
}

function TinyStat({ label, value }) {
  return (
    <div>
      <p className="truncate text-[9px] font-semibold uppercase tracking-wide text-slate-400">
        {label}
      </p>
      <p className="mt-1 text-xs font-bold tabular-nums text-slate-700">
        {value}
      </p>
    </div>
  );
}

export default AdvisorDesk;
