// 142000 → "₹1,42,000" (Indian digit grouping)
export const formatCurrency = (amount) =>
  new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(amount ?? 0);

// "2026-10" → "October 2026"
export const formatMonth = (month) => {
  if (!month) return "";
  const [year, monthNumber] = month.split("-").map(Number);
  return new Date(year, monthNumber - 1, 1).toLocaleString("en-IN", {
    month: "long",
    year: "numeric",
  });
};
// "2026-10-20" → "20 Oct 2026"
export const formatDate = (dateString) => {
  if (!dateString) return "";
  const [year, month, day] = dateString.split("-").map(Number);
  return new Date(year, month - 1, day).toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
};

// number of days from one date to another, counting both ends
export const daysBetween = (from, to) =>
  Math.round((new Date(to) - new Date(from)) / 86400000) + 1;

// today's date as "YYYY-MM-DD" in the user's own time zone
export const todayString = () => {
  const d = new Date();
  d.setMinutes(d.getMinutes() - d.getTimezoneOffset());
  return d.toISOString().slice(0, 10);
};