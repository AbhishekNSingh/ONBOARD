import { isValidElement } from "react";

// Centered placeholder displaying a calm empty state with optional icon and action
const EmptyState = ({
  title,
  message,
  icon: Icon,
  action,
  className = "",
}) => {
  return (
    <div
      className={`flex flex-col items-center justify-center px-4 py-12 text-center ${className}`}
    >
      {Icon && (
        <div
          className="mb-3 flex h-11 w-11 items-center justify-center rounded-full bg-soft text-primary"
          aria-hidden="true"
        >
          {isValidElement(Icon) ? Icon : <Icon className="h-5 w-5" />}
        </div>
      )}

      <h3 className="text-base font-semibold text-ink">{title}</h3>

      {message && (
        <p className="mt-1 max-w-sm text-sm text-ink-muted">{message}</p>
      )}

      {action && <div className="mt-4 flex items-center gap-3">{action}</div>}
    </div>
  );
};

export default EmptyState;
