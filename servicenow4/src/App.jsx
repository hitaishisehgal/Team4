import { useEffect, useState } from "react";
import AddStudentModal from "./components/AddStudentModal";
import AdvisorDesk from "./components/AdvisorDesk";
import Dashboard from "./components/Dashboard";
import DemoLogin from "./components/DemoLogin";
import FollowUpList from "./components/FollowUpList";
import InterventionModal from "./components/InterventionModal";
import StudentDetails from "./components/StudentDetails";
import StudentPortal from "./components/StudentPortal";
import seedStudents from "./data/students";
import { calculateRiskScore, getRiskLevel } from "./utils/riskCalculator";

const STUDENTS_KEY = "earlybird-students-v1";
const INTERVENTIONS_KEY = "earlybird-interventions-v1";

function App() {
  const [students, setStudents] = useState(() =>
    readStoredValue(STUDENTS_KEY, seedStudents)
  );
  const [interventions, setInterventions] = useState(() =>
    readStoredValue(INTERVENTIONS_KEY, {})
  );
  const [account, setAccount] = useState(null);
  const [selectedStudentId, setSelectedStudentId] = useState(null);
  const [activeView, setActiveView] = useState("workspace");
  const [interventionTarget, setInterventionTarget] = useState(null);
  const [showAddStudent, setShowAddStudent] = useState(false);

  useEffect(() => {
    try {
      localStorage.setItem(STUDENTS_KEY, JSON.stringify(students));
      localStorage.setItem(INTERVENTIONS_KEY, JSON.stringify(interventions));
    } catch (error) {
      console.error("Earlybird could not save demo data in browser storage.", error);
    }
  }, [students, interventions]);

  const selectedStudent = students.find(
    (student) => student.id === selectedStudentId
  );
  const allInterventions = Object.values(interventions);
  const activeInterventionCount = allInterventions.filter(
    (item) => item.status === "In progress"
  ).length;

  const login = (newAccount) => {
    setAccount(newAccount);
    setSelectedStudentId(null);
    setActiveView("workspace");
  };

  const logout = () => {
    setAccount(null);
    setSelectedStudentId(null);
    setActiveView("workspace");
    setInterventionTarget(null);
    setShowAddStudent(false);
  };

  const openStudent = (student) => {
    if (account?.role === "student") return;
    setSelectedStudentId(student.id);
    setActiveView("workspace");
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleAddStudent = (studentData) => {
    const newStudent = {
      id: students.reduce((highest, student) => Math.max(highest, student.id), 0) + 1,
      ...studentData,
    };
    setStudents((current) => [...current, newStudent]);
    setShowAddStudent(false);
    setSelectedStudentId(newStudent.id);
  };

  const handleInterventionConfirm = (intervention) => {
    setInterventions((current) => ({
      ...current,
      [intervention.studentId]: intervention,
    }));
    setInterventionTarget(null);
  };

  const sendMessage = (studentId, text, senderRole) => {
    const message = {
      senderRole,
      text,
      sentAt: new Date().toISOString(),
    };
    setInterventions((current) => {
      const intervention = current[studentId];
      if (!intervention) return current;
      return {
        ...current,
        [studentId]: {
          ...intervention,
          conversation: [...(intervention.conversation ?? []), message],
        },
      };
    });
  };

  const requestStudentCheckIn = (student, text) => {
    const score = calculateRiskScore(student);
    const nextReview = daysFromNow(7);
    const createdAt = new Date().toISOString();
    setInterventions((current) => ({
      ...current,
      [student.id]: {
        studentId: student.id,
        action: "Faculty check-in",
        priority: getRiskLevel(score),
        reason: "Student requested a one-to-one check-in",
        status: "In progress",
        nextReview,
        createdAt,
        conversation: [
          {
            senderRole: "student",
            text,
            sentAt: createdAt,
          },
        ],
      },
    }));
  };

  const closeFollowUp = (studentId, outcomeNote) => {
    setInterventions((current) => {
      const intervention = current[studentId];
      if (!intervention || intervention.status !== "In progress") {
        return current;
      }
      return {
        ...current,
        [studentId]: {
          ...intervention,
          status: "Completed",
          completedAt: new Date().toISOString(),
          outcomeNote,
        },
      };
    });
  };

  if (!account) {
    return (
      <div className="app-shell min-h-screen text-slate-900">
        <BrandHeader />
        <DemoLogin onLogin={login} />
        <AppFooter />
      </div>
    );
  }

  const isStudent = account.role === "student";
  const ownStudent = students.find((student) => student.id === account.studentId);
  const selectedIntervention = selectedStudent
    ? interventions[selectedStudent.id]
    : undefined;

  return (
    <div className="app-shell min-h-screen text-slate-900">
      <BrandHeader
        account={account}
        activeView={activeView}
        onNavigate={(view) => {
          setActiveView(view);
          setSelectedStudentId(null);
        }}
        onLogout={logout}
        activeInterventionCount={activeInterventionCount}
      />
      {isStudent ? (
        ownStudent ? (
          <StudentPortal
            student={ownStudent}
            intervention={interventions[ownStudent.id]}
            onSendMessage={sendMessage}
            onRequestCheckIn={(text) => requestStudentCheckIn(ownStudent, text)}
            onLogout={logout}
          />
        ) : (
          <main className="mx-auto max-w-2xl px-4 py-16 text-center">
            <h1 className="text-xl font-bold text-slate-900">
              Student profile unavailable
            </h1>
            <p className="mt-2 text-sm text-slate-500">
              This demo account is not linked to a student record.
            </p>
            <button
              type="button"
              onClick={logout}
              className="mt-5 rounded-xl bg-indigo-600 px-4 py-2.5 text-sm font-bold text-white"
            >
              Sign out
            </button>
          </main>
        )
      ) : activeView === "followups" ? (
        <FollowUpList
          interventions={allInterventions}
          students={students}
          onOpenStudent={(studentId) => {
            const student = students.find((entry) => entry.id === studentId);
            if (student) openStudent(student);
          }}
          onCloseFollowUp={closeFollowUp}
          onBack={() => setActiveView("workspace")}
          role={account.role}
        />
      ) : selectedStudent ? (
        <StudentDetails
          student={selectedStudent}
          intervention={selectedIntervention}
          onBack={() => setSelectedStudentId(null)}
          onTakeAction={() => setInterventionTarget(selectedStudent)}
          onSendMessage={sendMessage}
          senderRole={account.role}
        />
      ) : account.role === "advisor" ? (
        <AdvisorDesk
          students={students}
          interventions={interventions}
          onOpenStudent={openStudent}
          onViewFollowUps={() => setActiveView("followups")}
        />
      ) : (
        <Dashboard
          students={students}
          interventions={interventions}
          onStudentSelect={openStudent}
          onViewFollowUps={() => setActiveView("followups")}
          onAddStudent={() => setShowAddStudent(true)}
        />
      )}

      {interventionTarget && (
        <InterventionModal
          key={`${interventionTarget.id}-${interventions[interventionTarget.id]?.action ?? "new"}`}
          student={interventionTarget}
          existingIntervention={interventions[interventionTarget.id]}
          role={account.role}
          onClose={() => setInterventionTarget(null)}
          onConfirm={handleInterventionConfirm}
        />
      )}
      {showAddStudent && (
        <AddStudentModal
          onClose={() => setShowAddStudent(false)}
          onAdd={handleAddStudent}
        />
      )}
      <AppFooter />
    </div>
  );
}

function BrandHeader({
  account,
  activeView,
  onNavigate,
  onLogout,
  activeInterventionCount = 0,
}) {
  const primaryView =
    account?.role === "advisor"
      ? { key: "workspace", label: "Casework" }
      : { key: "workspace", label: account?.role === "student" ? "My space" : "Dashboard" };

  return (
    <header className="sticky top-0 z-30 border-b border-slate-200/80 bg-white/90 backdrop-blur-xl">
      <div className="mx-auto flex min-h-[76px] max-w-[1440px] items-center justify-between gap-3 px-4 sm:px-6 lg:px-10">
        <div className="flex min-w-0 items-center gap-3">
          <span className="brand-mark flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl text-white shadow-lg shadow-indigo-600/20">
            <svg viewBox="0 0 24 24" fill="none" className="h-5 w-5" aria-hidden="true">
              <path d="M4 18.5V12m5 6.5V6m5 12.5v-9m5 9V4" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" />
              <path d="M2.5 20.5h19" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" />
            </svg>
          </span>
          <span className="min-w-0">
            <span className="block truncate text-sm font-bold tracking-tight text-slate-950 sm:text-base">
              Earlybird
            </span>
            <span className="hidden text-[11px] font-medium text-slate-500 sm:block">
              Student Early Warning System
            </span>
          </span>
        </div>

        {account && (
          <>
            <nav
              aria-label="Main navigation"
              className="flex items-center gap-1 rounded-xl bg-slate-100/80 p-1"
            >
              <button
                type="button"
                onClick={() => onNavigate(primaryView.key)}
                aria-current={activeView === primaryView.key ? "page" : undefined}
                className={`rounded-lg px-3 py-2 text-xs font-semibold transition sm:px-4 sm:text-sm ${
                  activeView === primaryView.key
                    ? "bg-white text-indigo-700 shadow-sm"
                    : "text-slate-500 hover:text-slate-900"
                }`}
              >
                {primaryView.label}
              </button>
              {account.role !== "student" && (
                <button
                  type="button"
                  onClick={() => onNavigate("followups")}
                  aria-current={activeView === "followups" ? "page" : undefined}
                  className={`flex items-center gap-2 rounded-lg px-3 py-2 text-xs font-semibold transition sm:px-4 sm:text-sm ${
                    activeView === "followups"
                      ? "bg-white text-indigo-700 shadow-sm"
                      : "text-slate-500 hover:text-slate-900"
                  }`}
                >
                  Follow-ups
                  {activeInterventionCount > 0 && (
                    <span className="flex h-5 min-w-5 items-center justify-center rounded-full bg-indigo-100 px-1 text-[10px] font-bold text-indigo-700">
                      {activeInterventionCount}
                    </span>
                  )}
                </button>
              )}
            </nav>
            <div className="flex shrink-0 items-center gap-2">
              <span className="hidden text-right sm:block">
                <span className="block text-xs font-semibold text-slate-800">
                  {account.name}
                </span>
                <span className="block text-[10px] capitalize text-slate-500">
                  {account.role} demo
                </span>
              </span>
              <button
                type="button"
                onClick={onLogout}
                className="min-h-9 rounded-lg border border-slate-200 px-2.5 text-[11px] font-semibold text-slate-600 hover:bg-slate-50 sm:px-3"
              >
                Sign out
              </button>
            </div>
          </>
        )}
      </div>
    </header>
  );
}

function AppFooter() {
  return (
    <footer className="mx-auto max-w-[1440px] px-4 pb-8 pt-4 text-center sm:px-6 lg:px-10">
      <p className="text-xs text-slate-400">
        Earlybird highlights academic engagement signals to support timely,
        human check-ins — not to diagnose students.
      </p>
    </footer>
  );
}

function readStoredValue(key, fallback) {
  try {
    const rawValue = window.localStorage.getItem(key);
    if (!rawValue) return fallback;
    const parsedValue = JSON.parse(rawValue);
    if (key === STUDENTS_KEY && Array.isArray(parsedValue)) return parsedValue;
    if (
      key === INTERVENTIONS_KEY &&
      parsedValue &&
      typeof parsedValue === "object" &&
      !Array.isArray(parsedValue)
    ) {
      return parsedValue;
    }
    return fallback;
  } catch (error) {
    console.error(`Earlybird could not read ${key} from browser storage.`, error);
    return fallback;
  }
}

function daysFromNow(days) {
  const date = new Date();
  date.setDate(date.getDate() + days);
  date.setHours(12, 0, 0, 0);
  return date.toISOString();
}

export default App;
