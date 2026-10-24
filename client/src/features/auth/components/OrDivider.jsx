const OrDivider = () => (
  <div className="flex items-center gap-3" aria-hidden="true">
    <div className="h-px flex-1 bg-line" />
    <span className="text-xs text-ink-muted">or</span>
    <div className="h-px flex-1 bg-line" />
  </div>
);

export default OrDivider;