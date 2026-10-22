const Select = ({ label, id, error, className = "", children, ...rest }) => {
  return (
    <div className={`flex flex-col gap-1.5 ${className}`}>
      {label && (
        <label htmlFor={id} className="text-sm font-medium text-ink">
          {label}
        </label>
      )}

      <select
        id={id}
        className="w-full rounded-lg border border-line bg-card px-3 py-2 text-sm text-ink outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/20 disabled:cursor-not-allowed disabled:opacity-60"
        {...rest}
      >
        {children}
      </select>

      {error && <p className="text-xs text-bad">{error}</p>}
    </div>
  );
};

export default Select;