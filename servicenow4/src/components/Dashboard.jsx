import { useMemo, useState } from "react";
import {
  calculateRiskScore,
  getRiskLevel,
} from "../utils/riskCalculator";
import StudentTable from "./StudentTable";

const filters = ["All students", "High risk", "Medium risk", "Low risk", "In progress"];

function Dashboard({
  students,
  interventions,
  onStudentSelect,
  onViewFollowUps,
  onAddStudent,
}) {
  const [search, setSearch] = useState("");
  const [activeFilter, setActiveFilter] = useState("All students");

  const studentsWithRisk = useMemo(
    () =>
      students.map((student) => {
        const riskScore = calculateRiskScore(student);
        return {
          ...student,
          riskScore,
          riskLevel: getRiskLevel(riskScore),
          intervention: interventions[student.id],
        };
      }),
    [interventions, students]
  );

  const counts = {
    total: studentsWithRisk.length,
    high: studentsWithRisk.filter((student) => student.riskLevel === "High")
      .length,
    medium: studentsWithRisk.filter(
      (student) => student.riskLevel === "Medium"
    ).length,
    low: studentsWithRisk.filter((student) => student.riskLevel === "Low")
      .length,
  };

  const highRiskStudents = studentsWithRisk
    .filter((student) => student.riskLevel === "High")
    .sort((a, b) => b.riskScore - a.riskScore);
  const focusStudent = highRiskStudents[0];

  const visibleStudents = studentsWithRisk
    .filter((student) => {
      const matchesSearch = student.name
        .toLowerCase()
        .includes(search.trim().toLowerCase());
      const matchesFilter =
        activeFilter === "All students" ||
        (activeFilter === "In progress"
          ? student.intervention?.status === "In progress"
          : student.riskLevel === activeFilter.replace(" risk", ""));
      return matchesSearch && matchesFilter;
    })
    .sort((a, b) => b.riskScore - a.riskScore);

  const cards = [
    {
      label: "Students monitored",
      value: counts.total,
      note: "Across your cohort",
      icon: "✦",
      tone: "indigo",
    },
    {
      label: "High risk",
      value: counts.high,
      note: "Personal check-in recommended",
      icon: "↗",
      tone: "rose",
    },
    {
      label: "Medium risk",
      value: counts.medium,
      note: "Keep a closer eye",
      icon: "◷",
      tone: "amber",
    },
    {
      label: "Low risk",
      value: counts.low,
      note: "Looking steady",
      icon: "✓",
      tone: "emerald",
    },
  ];

  return (
    <main className="mx-auto max-w-[1440px] px-4 pb-10 pt-7 sm:px-6 lg:px-10 lg:pt-10">
      <div className="mb-8 flex flex-col justify-between gap-5 sm:flex-row sm:items-end">
        <div>
          <p className="section-kicker">Your student pulse</p>
          <h1 className="mt-2 text-3xl font-bold tracking-tight text-slate-950 sm:text-4xl">
            Good morning, Faculty <span aria-hidden="true">☀️</span>
          </h1>
          <p className="mt-2 text-sm leading-6 text-slate-500 sm:text-base">
            A little early support can make a big difference.
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            onClick={onAddStudent}
            className="inline-flex min-h-11 items-center justify-center gap-2 self-start rounded-xl bg-indigo-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-indigo-700"
          >
            <span aria-hidden="true">＋</span>
            Add student
          </button>
          <button
            type="button"
            onClick={onViewFollowUps}
            className="inline-flex min-h-11 items-center justify-center gap-2 self-start rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 shadow-sm transition hover:border-indigo-200 hover:text-indigo-700"
          >
            <span aria-hidden="true">↗</span>
            Follow-ups
            {Object.values(interventions).filter(
              (item) => item.status === "In progress"
            ).length > 0 && (
              <span className="ml-1 flex h-5 min-w-5 items-center justify-center rounded-full bg-indigo-100 px-1 text-[10px] font-bold text-indigo-700">
                {
                  Object.values(interventions).filter(
                    (item) => item.status === "In progress"
                  ).length
                }
              </span>
            )}
          </button>
        </div>
      </div>

      <section
        aria-label="Student risk summary"
        className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4"
      >
        {cards.map((card) => (
          <SummaryCard key={card.label} {...card} />
        ))}
      </section>

      {focusStudent && (
        <section className="focus-banner mt-6 overflow-hidden rounded-2xl p-5 text-white shadow-xl shadow-indigo-900/10 sm:p-7">
          <div className="relative z-10 flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
            <div className="max-w-2xl">
              <div className="flex flex-wrap items-center gap-2">
                <span className="rounded-full bg-white/15 px-3 py-1 text-[10px] font-bold uppercase tracking-[0.15em] text-indigo-50">
                  A gentle nudge
                </span>
                <span className="text-xs text-indigo-100">
                  Highest signal · Student #{focusStudent.id}
                </span>
              </div>
              <h2 className="mt-4 text-xl font-bold sm:text-2xl">
                Let&apos;s check in with {focusStudent.name}
              </h2>
              <p className="mt-2 max-w-xl text-sm leading-6 text-indigo-100">
                {focusStudent.attendance}% attendance,{" "}
                {focusStudent.missedAssignments} missed assignments, and a{" "}
                {Math.max(
                  0,
                  focusStudent.previousGrade - focusStudent.currentGrade
                )}
                -point grade decline. A friendly conversation could help uncover
                the right support.
              </p>
            </div>
            <div className="flex shrink-0 items-center gap-4">
              <div className="text-right">
                <p className="text-xs font-medium text-indigo-100">Risk score</p>
                <p className="text-3xl font-bold tabular-nums">
                  {focusStudent.riskScore}
                  <span className="text-base font-semibold text-indigo-200">
                    /100
                  </span>
                </p>
              </div>
              <button
                type="button"
                onClick={() => onStudentSelect(focusStudent)}
                className="min-h-11 rounded-xl bg-white px-4 py-2.5 text-sm font-bold text-indigo-700 shadow-sm transition hover:bg-indigo-50 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
              >
                Meet {focusStudent.name} <span aria-hidden="true">→</span>
              </button>
            </div>
          </div>
          <div aria-hidden="true" className="focus-orb focus-orb-one" />
          <div aria-hidden="true" className="focus-orb focus-orb-two" />
        </section>
      )}

      <section className="mt-8">
        <div className="mb-4 flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-lg font-bold tracking-tight text-slate-900">
                Student overview
              </h2>
              <span className="rounded-full bg-slate-100 px-2.5 py-1 text-[11px] font-semibold text-slate-500">
                {visibleStudents.length} of {counts.total}
              </span>
            </div>
            <p className="mt-1 text-sm text-slate-500">
              Start with a student to see what might be going on.
            </p>
          </div>
          <label className="relative block w-full lg:max-w-xs">
            <span className="sr-only">Search students</span>
            <svg
              viewBox="0 0 24 24"
              fill="none"
              className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400"
              aria-hidden="true"
            >
              <circle cx="10.8" cy="10.8" r="6.8" stroke="currentColor" strokeWidth="1.8" />
              <path d="m16 16 4.2 4.2" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
            </svg>
            <input
              type="search"
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Find a student..."
              className="min-h-11 w-full rounded-xl border border-slate-200 bg-white py-2.5 pl-10 pr-4 text-sm text-slate-800 shadow-sm outline-none transition placeholder:text-slate-400 focus:border-indigo-300 focus:ring-4 focus:ring-indigo-100"
            />
          </label>
        </div>

        <div
          className="mb-3 flex gap-2 overflow-x-auto pb-1"
          role="group"
          aria-label="Filter students"
        >
          {filters.map((filter) => (
            <button
              key={filter}
              type="button"
              onClick={() => setActiveFilter(filter)}
              aria-pressed={activeFilter === filter}
              className={`shrink-0 rounded-full px-3.5 py-2 text-xs font-semibold transition ${
                activeFilter === filter
                  ? "bg-slate-900 text-white shadow-sm"
                  : "border border-slate-200 bg-white text-slate-500 hover:border-slate-300 hover:text-slate-800"
              }`}
            >
              {filter}
            </button>
          ))}
        </div>

        <StudentTable
          students={visibleStudents}
          onStudentSelect={onStudentSelect}
        />
      </section>

      <p className="mt-5 text-center text-[11px] text-slate-400">
        Risk signals are conversation starters, not conclusions. Every student
        deserves context and care.
      </p>
    </main>
  );
}

function SummaryCard({ label, value, note, icon, tone }) {
  const colors = {
    indigo: "bg-indigo-50 text-indigo-700",
    rose: "bg-rose-50 text-rose-700",
    amber: "bg-amber-50 text-amber-700",
    emerald: "bg-emerald-50 text-emerald-700",
  };

  return (
    <article className="panel-card p-4 transition duration-200 hover:-translate-y-0.5 hover:shadow-lg hover:shadow-slate-200/70 sm:p-5">
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-xs font-semibold text-slate-500 sm:text-sm">
            {label}
          </p>
          <p className="mt-3 text-3xl font-bold tracking-tight text-slate-950 tabular-nums">
            {value}
          </p>
        </div>
        <span
          className={`flex h-10 w-10 items-center justify-center rounded-xl text-lg font-bold ${colors[tone]}`}
        >
          {icon}
        </span>
      </div>
      <p className="mt-3 text-[11px] font-medium text-slate-400">{note}</p>
    </article>
  );
}

export default Dashboard;
