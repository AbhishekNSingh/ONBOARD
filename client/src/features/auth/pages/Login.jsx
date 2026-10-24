import { useEffect, useState } from "react";
import { Link, Navigate, useNavigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import { roleHome } from "../utils/roleHome";
import AuthLayout from "../components/AuthLayout";
import GoogleButton from "../components/GoogleButton";
import OrDivider from "../components/OrDivider";
import Input from "../../shared/components/Input";
import Button from "../../shared/components/Button";

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
    <AuthLayout>
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

        {error && <p className="rounded-lg bg-bad-bg px-3.5 py-2.5 text-sm text-bad">{error}</p>}

        <Button type="submit" loading={loading} className="mt-1">
          Sign in
        </Button>

        <OrDivider />
        <GoogleButton text="signin_with" />

        <p className="text-center text-sm text-ink-muted">
          New here?{" "}
          <Link to="/register" className="font-medium text-primary hover:underline">
            Create an account
          </Link>
        </p>
      </form>
    </AuthLayout>
  );
};

export default Login;