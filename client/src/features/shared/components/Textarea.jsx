const Textarea = ({ label, id, error, className = "", ...rest }) => {
  return (
    <div className={`flex flex-col gap-1.5 ${className}`}>
      <label htmlFor={id} className="text-sm font-medium text-ink">
        {label}
      </label>

      <textarea
        id={id}
        rows={3}
        className="w-full resize-none rounded-lg border border-line bg-card px-3.5 py-2.5 text-sm text-ink outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/20 placeholder:text-ink-muted/70"
        {...rest}
      />

      {error && <p className="text-xs text-bad">{error}</p>}
    </div>
  );
};

export default Textarea;