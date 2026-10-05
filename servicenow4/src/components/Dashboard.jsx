import React from "react";
import StudentTable from "./StudentTable";

// Temporary UI data.
// Person 2 can replace this later with students.js.
const students = [
  {
    id: 1,
    name: "Kabir",
    attendance: 62,
    missedAssignments: 4,
    gradeChange: -15,
    riskScore: 82,
  },
  {
    id: 2,
    name: "Ananya",
    attendance: 91,
    missedAssignments: 0,
    gradeChange: 4,
    riskScore: 12,
  },
  {
    id: 3,
    name: "Rahul",
    attendance: 74,
    missedAssignments: 2,
    gradeChange: -8,
    riskScore: 56,
  },
  {
    id: 4,
    name: "Priya",
    attendance: 86,
    missedAssignments: 1,
    gradeChange: -2,
    riskScore: 31,
  },
  {
    id: 5,
    name: "Arjun",
    attendance: 58,
    missedAssignments: 5,
    gradeChange: -18,
    riskScore: 91,
  },
];

function getRiskLevel(score) {
  if (score < 40) return "Low";
  if (score < 70) return "Medium";
  return "High";
}

function Dashboard() {
  const studentsWithRisk = students.map((student) => ({
    ...student,
    riskLevel: getRiskLevel(student.riskScore),
  }));

  const totalStudents = studentsWithRisk.length;

  const lowRisk = studentsWithRisk.filter(
    (student) => student.riskLevel === "Low"
  ).length;

  const mediumRisk = studentsWithRisk.filter(
    (student) => student.riskLevel === "Medium"
  ).length;

  const highRisk = studentsWithRisk.filter(
    (student) => student.riskLevel === "High"
  ).length;

  const cards = [
    {
      title: "Total Students",
      value: totalStudents,
      description: "Students monitored",
      icon: "👥",
      background: "bg-blue-50",
      iconColor: "text-blue-600",
    },
    {
      title: "Low Risk",
      value: lowRisk,
      description: "No immediate concern",
      icon: "✓",
      background: "bg-green-50",
      iconColor: "text-green-600",
    },
    {
      title: "Medium Risk",
      value: mediumRisk,
      description: "Needs monitoring",
      icon: "!",
      background: "bg-yellow-50",
      iconColor: "text-yellow-600",
    },
    {
      title: "High Risk",
      value: highRisk,
      description: "Needs early support",
      icon: "⚠",
      background: "bg-red-50",
      iconColor: "text-red-600",
    },
  ];

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header */}
      <header className="border-b border-slate-200 bg-white">
        <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
          <h1 className="text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">
            Student Early Warning System
          </h1>

          <p className="mt-2 text-sm text-slate-500">
            Identify students who may need early academic support.
          </p>
        </div>
      </header>

      <main className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
        {/* Summary Cards */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {cards.map((card) => (
            <div
              key={card.title}
              className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm transition-shadow hover:shadow-md"
            >
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-sm font-medium text-slate-500">
                    {card.title}
                  </p>

                  <p className="mt-2 text-3xl font-bold text-slate-900">
                    {card.value}
                  </p>

                  <p className="mt-1 text-xs text-slate-400">
                    {card.description}
                  </p>
                </div>

                <div
                  className={`flex h-11 w-11 items-center justify-center rounded-lg text-lg font-bold ${card.background} ${card.iconColor}`}
                >
                  {card.icon}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Table Section */}
        <section className="mt-8">
          <div className="mb-4">
            <h2 className="text-lg font-semibold text-slate-900">
              Student Risk Overview
            </h2>

            <p className="mt-1 text-sm text-slate-500">
              Review student attendance, assignments, grades and risk levels.
            </p>
          </div>

          <StudentTable students={studentsWithRisk} />
        </section>
      </main>
    </div>
  );
}

export default Dashboard;