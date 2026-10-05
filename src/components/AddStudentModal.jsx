import { useState } from "react";

const fields = [
  { key: "attendance", label: "Current attendance (%)" },
  { key: "previousAttendance", label: "Previous attendance (%)" },
  { key: "missedAssignments", label: "Missed assignments", max: 30 },
  { key: "currentGrade", label: "Current grade (%)" },
  { key: "previousGrade", label: "Previous grade (%)" },
];

function AddStudentModal({ onClose, onAdd }) {
  const [name, setName] = useState("");
  const [values, setValues] = useState({
    attendance: "",
    previousAttendance: "",
    missedAssignments: "",
    currentGrade: "",
    previousGrade: "",
  });
  const [error, setError] = useState("");

  const submit = (event) => {
    event.preventDefault();
    const student = {
      name: name.trim(),
      ...Object.fromEntries(
        Object.entries(values).map(([key, value]) => [key, Number(value)])
      ),
    };

    if (!student.name) {
      setError("Enter a student name.");
      return;
    }
    if (
      ["attendance", "previousAttendance", "currentGrade", "previousGrade"].some(
        (key) => student[key] < 0 || student[key] > 100
      ) ||
      student.missedAssignments < 0
    ) {
      setError("Attendance and grades must be 0–100, and missed assignments cannot be negative.");
      return;
    }

    onAdd(student);
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
        aria-labelledby="add-student-title"
        className="modal-panel w-full max-w-xl rounded-t-3xl bg-white shadow-2xl sm:rounded-3xl"
      >
        <header className="border-b border-slate-100 px-6 py-5 sm:px-7">
          <p className="section-kicker">Faculty workspace</p>
          <h2 id="add-student-title" className="mt-1 text-xl font-bold text-slate-950">
            Add a student record
          </h2>
          <p className="mt-1 text-sm text-slate-500">
            This fictional demo record is saved in this browser only.
          </p>
        </header>

        <form onSubmit={submit}>
          <div className="grid max-h-[60vh] gap-4 overflow-y-auto px-6 py-5 sm:grid-cols-2 sm:px-7">
            <label className="block sm:col-span-2">
              <span className="mb-1.5 block text-xs font-semibold text-slate-700">
                Student name
              </span>
              <input
                autoFocus
                value={name}
                onChange={(event) => setName(event.target.value)}
                maxLength={60}
                required
                className="min-h-11 w-full rounded-xl border border-slate-200 px-3.5 text-sm outline-none focus:border-indigo-400 focus:ring-4 focus:ring-indigo-100"
              />
            </label>
            {fields.map((field) => (
              <label key={field.key} className="block">
                <span className="mb-1.5 block text-xs font-semibold text-slate-700">
                  {field.label}
                </span>
                <input
                  type="number"
                  min="0"
                  max={field.max ?? 100}
                  step="1"
                  value={values[field.key]}
                  onChange={(event) => {
                    setValues((current) => ({
                      ...current,
                      [field.key]: event.target.value,
                    }));
                    setError("");
                  }}
                  required
                  className="min-h-11 w-full rounded-xl border border-slate-200 px-3.5 text-sm outline-none focus:border-indigo-400 focus:ring-4 focus:ring-indigo-100"
                />
              </label>
            ))}
            {error && (
              <p role="alert" className="text-xs text-rose-700 sm:col-span-2">
                {error}
              </p>
            )}
          </div>
          <footer className="flex flex-col-reverse gap-2 border-t border-slate-100 bg-slate-50/70 px-6 py-4 sm:flex-row sm:justify-end sm:px-7">
            <button
              type="button"
              onClick={onClose}
              className="min-h-11 rounded-xl px-4 py-2 text-sm font-semibold text-slate-600 hover:bg-slate-100"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="min-h-11 rounded-xl bg-indigo-600 px-5 py-2.5 text-sm font-bold text-white hover:bg-indigo-700"
            >
              Add student
            </button>
          </footer>
        </form>
      </section>
    </div>
  );
}

export default AddStudentModal;
