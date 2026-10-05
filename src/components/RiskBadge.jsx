function RiskBadge({ score }) {
  let label;
  let styles;

  if (score < 40) {
    label = "Low";
    styles = "bg-green-100 text-green-700 ring-green-600/20";
  } else if (score < 70) {
    label = "Medium";
    styles = "bg-yellow-100 text-yellow-700 ring-yellow-600/20";
  } else {
    label = "High";
    styles = "bg-red-100 text-red-700 ring-red-600/20";
  }

  return (
    <span
      aria-label={`${label} risk`}
      className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold ring-1 ring-inset ${styles}`}
    >
      <span
        aria-hidden="true"
        className={`mr-1.5 h-1.5 w-1.5 rounded-full ${
          label === "High"
            ? "bg-red-500"
            : label === "Medium"
              ? "bg-yellow-500"
              : "bg-green-500"
        }`}
      />
      {label}
    </span>
  );
}

export default RiskBadge;