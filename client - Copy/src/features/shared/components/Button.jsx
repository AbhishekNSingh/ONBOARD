const styles = {
  primary: "bg-primary text-on-primary hover:bg-primary-hover",
  ghost: "border border-line bg-transparent text-ink hover:bg-soft",
};

const Button = ({
  children,
  variant = "primary",
  loading = false,
  className = "",
  ...rest
}) => {
  return (
    <button
      disabled={loading || rest.disabled}
      className={`w-full rounded-lg px-4 py-3 text-sm font-medium transition-colors duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary/40 disabled:cursor-not-allowed disabled:opacity-60 ${styles[variant]} ${className}`}
      {...rest}
    >
      {loading ? "Please wait…" : children}
    </button>
  );
};

export default Button;