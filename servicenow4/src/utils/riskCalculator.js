function calculateRiskScore(student) {
  let attendancePoints = 0;
  let assignmentPoints = 0;
  let gradePoints = 0;

  // Attendance
  if (student.attendance >= 80) {
    attendancePoints = 0;
  } else if (student.attendance >= 70) {
    attendancePoints = 20;
  } else {
    attendancePoints = 40;
  }

  // Missed assignments
  if (student.missedAssignments <= 1) {
    assignmentPoints = 0;
  } else if (student.missedAssignments <= 3) {
    assignmentPoints = 15;
  } else {
    assignmentPoints = 30;
  }

  // Grade decline
  const gradeDecline =
    student.previousGrade - student.currentGrade;

  if (gradeDecline < 5) {
    gradePoints = 0;
  } else if (gradeDecline < 10) {
    gradePoints = 15;
  } else {
    gradePoints = 30;
  }

  return attendancePoints + assignmentPoints + gradePoints;
}

function getRiskLevel(score) {
  if (score < 40) {
    return "Low";
  }

  if (score < 70) {
    return "Medium";
  }

  return "High";
}

function getRiskReasons(student) {
  const reasons = [];

  const attendanceDrop =
    student.previousAttendance - student.attendance;

  const gradeDecline =
    student.previousGrade - student.currentGrade;

  if (student.attendance < 70) {
    reasons.push("Attendance is below 70%");
  } else if (attendanceDrop >= 10) {
    reasons.push(
      `Attendance dropped by ${attendanceDrop} percentage points`
    );
  }

  if (student.missedAssignments >= 2) {
    reasons.push(
      `${student.missedAssignments} assignments missed`
    );
  }

  if (gradeDecline >= 5) {
    reasons.push(
      `Grade declined by ${gradeDecline} percentage points`
    );
  }

  return reasons;
}

// Used by Person 1's Dashboard
function calculateRisk(student) {
  const score = calculateRiskScore(student);

  return {
    score,
    level: getRiskLevel(score),
    reasons: getRiskReasons(student),
  };
}

export {
  calculateRisk,
  calculateRiskScore,
  getRiskLevel,
  getRiskReasons,
};