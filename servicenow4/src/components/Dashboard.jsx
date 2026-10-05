import React from "react";
import students from "../data/students";
import { calculateRisk } from "../utils/riskCalculator";
import StudentTable from "./studenttable";

function Dashboard() {
  const studentsWithRisk = students.map((student) => ({
    ...student,
    risk: calculateRisk(student),
  }));

  const totalStudents = studentsWithRisk.length;

  const lowRisk = studentsWithRisk.filter(
    (student) => student.risk.score < 40
  ).length;

  const mediumRisk = studentsWithRisk.filter(
    (student) => student.risk.score >= 40 && student.risk.score < 70
  ).length;

  const highRisk = studentsWithRisk.filter(
    (student) => student.risk.score >= 70
  ).length;

  const cards = [
    {
      title: "Total Students",
      value: totalStudents,
      icon: "👥",
      style: "bg-blue-50 text-blue-700",
    },
    {
      title: "Low Risk",
      value: lowRisk,
      icon: "✓",
      style: "bg-green-50 text-green-700",
    },
    {
      title: "Medium Risk",
      value: mediumRisk,
      icon: "!",
      style: "bg-yellow-50 text-yellow-700",
    },
    {
      title: "High Risk",
      value: highRisk,
      icon: "⚠",
      style: "bg-red-50 text-red-700",
    },
  ];

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header */}
      <header className="border-b border-slate-200 bg-white">
        <div className="mx-auto max-w-7xl px-4 py-5 sm:px-6 lg:px-8">
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-slate-900">
              Student Early Warning System
            </h1>

            <p className="mt-1 text-sm text-slate-500">
              Monitor student performance and identify students who may need
              early support.
            </p>
          </div>
        </div>
      </header>

      {/* Main */}
      <main className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
        {/* Summary cards */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {cards.map((card) => (
            <div
              key={card.title}
              className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-slate-500">
                    {card.title}
                  </p>

                  <p className="mt-2 text-3xl font-bold text-slate-900">
                    {card.value}
                  </p>
                </div>

                <div
                  className={`flex h-11 w-11 items-center justify-center rounded-lg text-lg font-bold ${card.style}`}
                >
                  {card.icon}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Student table */}
        <div className="mt-8">
          <div className="mb-4">
            <h2 className="text-lg font-semibold text-slate-900">
              Student Risk Overview
            </h2>

            <p className="mt-1 text-sm text-slate-500">
              Review attendance, assignments and grade trends to identify
              students requiring attention.
            </p>
          </div>

          <StudentTable students={studentsWithRisk} />
        </div>
      </main>
    </div>
  );
}

export default Dashboard;