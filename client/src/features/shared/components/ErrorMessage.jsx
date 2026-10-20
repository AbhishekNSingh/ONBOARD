// Feedback box for displaying error messages with an optional retry button
const ErrorMessage = ({ message, onRetry, className = "" }) => {
  return (
    <div
      role="alert"
      className={`flex flex-col gap-3 rounded-lg bg-bad-bg px-4 py-3 text-sm text-bad sm:flex-row sm:items-center sm:justify-between ${className}`}
    >
      <span>{message}</span>

      {onRetry && (
        <button
          type="button"
          onClick={onRetry}
          className="inline-flex shrink-0 self-start rounded-lg border border-line bg-card px-3 py-1 text-xs font-medium text-ink transition-colors hover:bg-soft focus:outline-none focus-visible:ring-2 focus-visible:ring-primary/40 sm:self-auto"
        >
          Try again
        </button>
      )}
    </div>
  );
};

export default ErrorMessage;
