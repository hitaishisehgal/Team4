# Earlybird — Student Early Warning System

Earlybird is a small role-based prototype for noticing changes in academic
engagement and starting a supportive conversation early. It uses fictional
student data and runs entirely in the browser; it has no backend, database, or
real authentication.

## Run locally

```sh
npm install
npm run dev
```

Useful checks:

```sh
npm run build
npm run lint
```

## Demo flow

Sign-in IDs and passwords (all demo-only):

| View | ID | Password |
| --- | --- | --- |
| Faculty | `faculty` | `teach123` |
| Academic advisor | `advisor` | `guide123` |
| Student (Kabir) | `kabir` | `kabir123` |

Faculty can review the cohort, search/filter records, add fictional students,
open student details, create support actions, and manage follow-ups. Academic
advisors have a casework view for reviewing signals and coordinating academic
advisor/student support actions. The student account only sees Kabir's own
learning snapshot and support conversation, not risk scores or other students.

For the end-to-end demo, sign in as faculty, open Kabir, start a **Faculty
check-in**, then sign out and use the student account to reply in the local
conversation. Return as faculty and close the follow-up with an outcome note.

## Data and follow-up lifecycle

Faculty adds a student from **Add student** on the dashboard. The entry uses the
same data shape as the seed data and is stored in browser `localStorage` so it
survives reloads in this browser. Follow-ups and conversation messages are
stored the same way. Follow-ups can be closed from **Follow-ups** by a faculty
member or advisor, with an optional outcome note; closed cases remain visible
under **Completed**. The student sign-in is currently provisioned only for the
Kabir demo record; adding a student creates a cohort record, not login credentials.

The sample IDs and passwords are visible in the UI and are not secure
authentication. Do not enter real or sensitive student information. Demo
messages stay in this browser and are not sent anywhere.

## Shared data and risk model

The fictional student records are in `src/data/students.js`. Use their existing
shape when adding records:

```js
{
  id: 1,
  name: "Kabir",
  attendance: 62,
  previousAttendance: 79,
  missedAssignments: 4,
  currentGrade: 58,
  previousGrade: 73
}
```

Risk scoring is centralized in `src/utils/riskCalculator.js`; UI components
should import `calculateRiskScore`, `getRiskLevel`, and `getRiskReasons`
instead of implementing their own thresholds. The current model assigns
0/20/40 points for attendance, 0/15/30 for missed assignments, and 0/15/30 for
grade decline. Score levels are Low (0–39), Medium (40–69), and High (70–100).

These signals are conversation starters, not diagnoses or a complete picture
of a student's circumstances.
