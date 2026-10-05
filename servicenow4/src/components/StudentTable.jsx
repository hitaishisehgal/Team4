import React from "react";
import RiskBadge from "./riskbadge";

function StudentTable({ students }) {
  const handleStudentClick = (student) => {
    /*
      If React Router is already configured, replace this with:

      navigate(`/students/${student.id}`);

      Do not create a new student structure.
    */

    console.log("Open student:", student.id);
  };

  return (
    <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-slate-200">
          <thead className="bg-slate-50">
            <tr>
              <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-slate-500">
                Student
              </th>

              <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-slate-500">
                Attendance
              </th>

              <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-slate-500">
                Missed Assignments
              </th>

              <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-slate-500">
                Grade Change
              </th>

              <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-slate-500">
                Risk Score
              </th>

              <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-slate-500">
                Risk Level
              </th>
            </tr>
          </thead>

          <tbody className="divide-y divide-slate-100 bg-white">
            {students.map((student) => {
              const score = student.risk.score;

              const gradeChange =
                student.currentGrade - student.previousGrade;

              const isHighRisk = score >= 70;

              return (
                <tr
                  key={student.id}
                  onClick={() => handleStudentClick(student)}
                  className={`cursor-pointer transition-colors hover:bg-slate-50 ${
                    isHighRisk ? "bg-red-50/40" : ""
                  }`}
                >
                  {/* Student */}
                  <td className="whitespace-nowrap px-6 py-4">
                    <div className="flex items-center">
                      <div className="flex h-9 w-9 items-center justify-center rounded-full bg-slate-100 text-sm font-semibold text-slate-700">
                        {student.name.charAt(0).toUpperCase()}
                      </div>

                      <div className="ml-3">
                        <p className="text-sm font-semibold text-slate-900">
                          {student.name}
                        </p>

                        <p className="text-xs text-slate-500">
                          Student #{student.id}
                        </p>
                      </div>
                    </div>
                  </td>

                  {/* Attendance */}
                  <td className="whitespace-nowrap px-6 py-4">
                    <span
                      className={`text-sm font-medium ${
                        student.attendance < 70
                          ? "text-red-600"
                          : "text-slate-700"
                      }`}
                    >
                      {student.attendance}%
                    </span>
                  </td>

                  {/* Missed assignments */}
                  <td className="whitespace-nowrap px-6 py-4">
                    <span
                      className={`text-sm font-medium ${
                        student.missedAssignments >= 3
                          ? "text-red-600"
                          : "text-slate-700"
                      }`}
                    >
                      {student.missedAssignments}
                    </span>
                  </td>

                  {/* Grade change */}
                  <td className="whitespace-nowrap px-6 py-4">
                    <span
                      className={`text-sm font-semibold ${
                        gradeChange < 0
                          ? "text-red-600"
                          : gradeChange > 0
                          ? "text-green-600"
                          : "text-slate-600"
                      }`}
                    >
                      {gradeChange > 0 ? "+" : ""}
                      {gradeChange}
                    </span>
                  </td>

                  {/* Risk score */}
                  <td className="whitespace-nowrap px-6 py-4">
                    <span
                      className={`text-sm font-bold ${
                        isHighRisk
                          ? "text-red-600"
                          : score >= 40
                          ? "text-yellow-600"
                          : "text-green-600"
                      }`}
                    >
                      {score}
                    </span>
                  </td>

                  {/* Risk badge */}
                  <td className="whitespace-nowrap px-6 py-4">
                    <RiskBadge score={score} />
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {students.length === 0 && (
        <div className="px-6 py-12 text-center">
          <p className="text-sm text-slate-500">
            No students available.
          </p>
        </div>
      )}
    </div>
  );
}

export default StudentTable;