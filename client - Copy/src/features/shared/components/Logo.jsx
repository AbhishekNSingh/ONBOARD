const Logo = ({ className = "" }) => (
  <span
    className={`inline-flex items-center gap-1.5 text-lg font-semibold tracking-tight text-ink ${className}`}
  >
    onboard
    <span className="h-2 w-2 rounded-full bg-accent" aria-hidden="true" />
  </span>
);

export default Logo;