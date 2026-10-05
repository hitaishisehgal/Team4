import React from "react";
import RiskBadge from "./RiskBadge";

function StudentTable({ students }) {
  const handleStudentClick = (student) => {
    // Person 5 can connect this to StudentDetails.jsx later.
    console.log("Selected student:", student.id);
  };

  return (
    <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-slate-200">
          <thead className="bg-slate-50">
            <tr>
              <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                Student
              </th>

              <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                Attendance
              </th>

              <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                Missed Assignments
              </th>

              <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                Grade Change
              </th>

              <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                Risk Score
              </th>

              <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                Risk Level
              </th>
            </tr>
          </thead>

          <tbody className="divide-y divide-slate-100">
            {students.map((student) => {
              const isHighRisk = student.riskScore >= 70;

              return (
                <tr
                  key={student.id}
                  onClick={() => handleStudentClick(student)}
                  className={`cursor-pointer transition-colors hover:bg-slate-50 ${
                    isHighRisk ? "bg-red-50/50" : "bg-white"
                  }`}
                >
                  {/* Student */}
                  <td className="whitespace-nowrap px-6 py-4">
                    <div className="flex items-center">
                      <div
                        className={`flex h-10 w-10 items-center justify-center rounded-full text-sm font-bold ${
                          isHighRisk
                            ? "bg-red-100 text-red-700"
                            : "bg-slate-100 text-slate-700"
                        }`}
                      >
                        {student.name.charAt(0)}
                      </div>

                      <div className="ml-3">
                        <p className="text-sm font-semibold text-slate-900">
                          {student.name}
                        </p>

                        <p className="text-xs text-slate-400">
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

                  {/* Assignments */}
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

                  {/* Grade Change */}
                  <td className="whitespace-nowrap px-6 py-4">
                    <span
                      className={`text-sm font-semibold ${
                        student.gradeChange < 0
                          ? "text-red-600"
                          : student.gradeChange > 0
                          ? "text-green-600"
                          : "text-slate-500"
                      }`}
                    >
                      {student.gradeChange > 0 ? "+" : ""}
                      {student.gradeChange}
                    </span>
                  </td>

                  {/* Risk Score */}
                  <td className="whitespace-nowrap px-6 py-4">
                    <span
                      className={`text-sm font-bold ${
                        student.riskScore >= 70
                          ? "text-red-600"
                          : student.riskScore >= 40
                          ? "text-yellow-600"
                          : "text-green-600"
                      }`}
                    >
                      {student.riskScore}
                    </span>
                  </td>

                  {/* Risk Badge */}
                  <td className="whitespace-nowrap px-6 py-4">
                    <RiskBadge score={student.riskScore} />
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
            No student data available.
          </p>
        </div>
      )}
    </div>
  );
}

export default StudentTable;