import RiskBadge from "./RiskBadge";

function StudentTable({ students, onStudentSelect }) {
  return (
    <div className="panel-card overflow-hidden">
      <div className="overflow-x-auto">
        <table className="min-w-[850px] w-full border-collapse text-left">
          <thead>
            <tr className="border-b border-slate-100 bg-slate-50/70">
              <th
                scope="col"
                className="px-5 py-3.5 text-[10px] font-bold uppercase tracking-[0.12em] text-slate-400 sm:px-6"
              >
                Student
              </th>
              <th
                scope="col"
                className="px-4 py-3.5 text-[10px] font-bold uppercase tracking-[0.12em] text-slate-400"
              >
                Attendance
              </th>
              <th
                scope="col"
                className="px-4 py-3.5 text-[10px] font-bold uppercase tracking-[0.12em] text-slate-400"
              >
                Missed work
              </th>
              <th
                scope="col"
                className="px-4 py-3.5 text-[10px] font-bold uppercase tracking-[0.12em] text-slate-400"
              >
                Grade change
              </th>
              <th
                scope="col"
                className="px-4 py-3.5 text-[10px] font-bold uppercase tracking-[0.12em] text-slate-400"
              >
                Risk score
              </th>
              <th
                scope="col"
                className="px-4 py-3.5 text-[10px] font-bold uppercase tracking-[0.12em] text-slate-400"
              >
                Level
              </th>
              <th
                scope="col"
                className="px-4 py-3.5 text-[10px] font-bold uppercase tracking-[0.12em] text-slate-400"
              >
                Follow-up
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {students.map((student) => {
              const gradeChange = student.currentGrade - student.previousGrade;
              const highRisk = student.riskLevel === "High";
              return (
                <tr
                  key={student.id}
                  className={`transition-colors hover:bg-indigo-50/40 ${
                    highRisk ? "bg-rose-50/25" : "bg-white"
                  }`}
                >
                  <td className="whitespace-nowrap px-5 py-4 sm:px-6">
                    <button
                      type="button"
                      onClick={() => onStudentSelect(student)}
                      className="group flex items-center gap-3 rounded-lg text-left focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-indigo-600"
                    >
                      <span
                        className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl text-sm font-bold ${
                          highRisk
                            ? "bg-rose-100 text-rose-700"
                            : "bg-indigo-50 text-indigo-700"
                        }`}
                      >
                        {student.name.charAt(0).toUpperCase()}
                      </span>
                      <span>
                        <span className="block text-sm font-bold text-slate-800 group-hover:text-indigo-700">
                          {student.name}
                        </span>
                        <span className="mt-0.5 block text-[11px] text-slate-400">
                          Student #{student.id}
                        </span>
                      </span>
                    </button>
                  </td>
                  <td className="whitespace-nowrap px-4 py-4">
                    <span
                      className={`text-sm font-semibold tabular-nums ${
                        student.attendance < 70
                          ? "text-rose-700"
                          : "text-slate-700"
                      }`}
                    >
                      {student.attendance}%
                    </span>
                    <span className="ml-1.5 text-[11px] text-slate-400">
                      now
                    </span>
                  </td>
                  <td className="whitespace-nowrap px-4 py-4">
                    <span
                      className={`text-sm font-semibold tabular-nums ${
                        student.missedAssignments >= 4
                          ? "text-rose-700"
                          : "text-slate-700"
                      }`}
                    >
                      {student.missedAssignments}
                    </span>
                    <span className="ml-1.5 text-[11px] text-slate-400">
                      assignments
                    </span>
                  </td>
                  <td className="whitespace-nowrap px-4 py-4">
                    <span
                      className={`text-sm font-bold tabular-nums ${
                        gradeChange < 0
                          ? "text-rose-700"
                          : gradeChange > 0
                            ? "text-emerald-700"
                            : "text-slate-500"
                      }`}
                    >
                      {gradeChange > 0 ? "+" : ""}
                      {gradeChange} pts
                    </span>
                  </td>
                  <td className="whitespace-nowrap px-4 py-4">
                    <span
                      className={`text-sm font-bold tabular-nums ${
                        highRisk
                          ? "text-rose-700"
                          : student.riskLevel === "Medium"
                            ? "text-amber-700"
                            : "text-emerald-700"
                      }`}
                    >
                      {student.riskScore}
                    </span>
                    <span className="text-[11px] text-slate-400"> /100</span>
                  </td>
                  <td className="whitespace-nowrap px-4 py-4">
                    <RiskBadge score={student.riskScore} />
                  </td>
                  <td className="whitespace-nowrap px-4 py-4">
                    {student.intervention ? (
                      <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-amber-700">
                        <span className="h-1.5 w-1.5 rounded-full bg-amber-500" />
                        In progress
                      </span>
                    ) : (
                      <span className="text-xs font-medium text-slate-400">
                        —
                      </span>
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
      {students.length === 0 && (
        <div className="px-6 py-16 text-center">
          <span className="text-3xl" aria-hidden="true">
            🔎
          </span>
          <p className="mt-3 text-sm font-semibold text-slate-700">
            No students match those filters
          </p>
          <p className="mt-1 text-xs text-slate-500">
            Try another name or risk level.
          </p>
        </div>
      )}
      {students.length > 0 && (
        <div className="border-t border-slate-100 px-5 py-3 text-[11px] text-slate-400 sm:px-6">
          Select a student to explore their risk signals and support options.
        </div>
      )}
    </div>
  );
}

export default StudentTable;
