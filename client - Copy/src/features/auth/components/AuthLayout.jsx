import Logo from "../../shared/components/Logo";

const AuthLayout = ({ children }) => {
  return (
    <div className="flex min-h-screen flex-col lg:flex-row">
      {/* LEFT: brand panel, hidden on small screens */}
      <div className="hidden bg-soft lg:flex lg:w-1/2 lg:flex-col lg:justify-between lg:p-14">
        <Logo />
        <div>
          <h2 className="text-4xl font-semibold leading-tight tracking-tight text-ink xl:text-5xl">
            Everything your team needs, in one calm place.
          </h2>
          <p className="mt-5 max-w-sm text-base leading-relaxed text-ink-muted">
            Attendance, leaves, salaries and performance, organised by role.
          </p>
        </div>
        <p className="text-sm text-ink-muted">Built for admins, managers and employees.</p>
      </div>

      {/* RIGHT: whatever page is placed inside */}
      <div className="flex w-full items-center justify-center px-6 py-14 lg:w-1/2">
        <div className="w-full max-w-sm">
          <Logo className="mb-10 lg:hidden" />
          {children}
        </div>
      </div>
    </div>
  );
};

export default AuthLayout;