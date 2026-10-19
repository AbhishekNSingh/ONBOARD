import { useEffect, useState } from "react";
import { Link, Navigate, useNavigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import Input from "../../shared/components/Input";
import Button from "../../shared/components/Button";
import Logo from "../../shared/components/Logo";

const roleHome = {
  employee: "/employee",
  manager: "/manager",
  admin: "/admin",
};

const Login = () => {
  const navigate = useNavigate();
  const { user, isChecking, loading, error, handleLogin, resetError } = useAuth();
  const [form, setForm] = useState({ email: "", password: "" });

  useEffect(() => {
    resetError();
  }, [resetError]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const loggedInUser = await handleLogin(form);
      navigate(roleHome[loggedInUser.role], { replace: true });
    } catch {
      // the message is already in the store and shown below
    }
  };

  if (!isChecking && user) {
    return <Navigate to={roleHome[user.role]} replace />;
  }

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

      {/* RIGHT: form */}
      <div className="flex w-full items-center justify-center px-6 py-14 lg:w-1/2">
        <div className="w-full max-w-sm">
          <Logo className="mb-10 lg:hidden" />

          <h1 className="text-3xl font-semibold tracking-tight text-ink">Welcome back</h1>
          <p className="mt-2 text-sm text-ink-muted">Sign in to continue to your dashboard.</p>

          <form onSubmit={handleSubmit} className="mt-9 flex flex-col gap-5">
            <Input
              id="login-email"
              label="Email"
              type="email"
              name="email"
              value={form.email}
              onChange={handleChange}
              placeholder="you@company.com"
              required
            />

            <Input
              id="login-password"
              label="Password"
              type="password"
              name="password"
              value={form.password}
              onChange={handleChange}
              placeholder="Enter your password"
              required
            />

            {error && (
              <p className="rounded-lg bg-bad-bg px-3.5 py-2.5 text-sm text-bad">{error}</p>
            )}

            <Button type="submit" loading={loading} className="mt-1">
              Sign in
            </Button>

            <p className="text-center text-sm text-ink-muted">
              New here?{" "}
              <Link to="/register" className="font-medium text-primary hover:underline">
                Create an account
              </Link>
            </p>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Login;