/* eslint-disable react-refresh/only-export-components */

const toneStyles = {
  success: "bg-ok-bg text-ok",
  warning: "bg-warn-bg text-warn",
  danger: "bg-bad-bg text-bad",
  info: "bg-soft text-primary",
  neutral: "border border-line text-ink-muted",
};

// Maps common entity status strings to corresponding visual tones
export const statusTone = (status) => {
  const normalized = typeof status === "string" ? status.toLowerCase().trim() : "";
  switch (normalized) {
    case "pending":
      return "warning";
    case "approved":
    case "paid":
    case "present":
      return "success";
    case "rejected":
    case "failed":
    case "absent":
      return "danger";
    case "leave":
      return "info";
    default:
      return "neutral";
  }
};

// Compact pill badge with semantic tone styling
const Badge = ({ children, tone = "neutral", className = "" }) => {
  const toneClass = toneStyles[tone] || toneStyles.neutral;

  return (
    <span
      className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${toneClass} ${className}`}
    >
      {children}
    </span>
  );
};

export default Badge;
