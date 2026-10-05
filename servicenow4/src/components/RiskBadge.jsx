import React from "react";

function RiskBadge({ score }) {
  let label;
  let classes;

  if (score < 40) {
    label = "Low";
    classes = "bg-green-100 text-green-700 ring-green-600/20";
  } else if (score < 70) {
    label = "Medium";
    classes = "bg-yellow-100 text-yellow-700 ring-yellow-600/20";
  } else {
    label = "High";
    classes = "bg-red-100 text-red-700 ring-red-600/20";
  }

  return (
    <span
      className={`inline-flex items-center rounded-full px-2.5 py-1 text-xs font-semibold ring-1 ring-inset ${classes}`}
    >
      {label}
    </span>
  );
}

export default RiskBadge;