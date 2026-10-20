import { useEffect, useState } from "react";
import { Link, Navigate, useNavigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import { roleHome } from "../utils/roleHome";
import AuthLayout from "../components/AuthLayout";
import Input from "../../shared/components/Input";
import Button from "../../shared/components/Button";

const Register = () => {
  const navigate = useNavigate();
  const { user, isChecking, loading, error, handleRegister, resetError } = useAuth();

  const [form, setForm] = useState({
    name: "",
    email: "",
    contact: "",
    password: "",
  });

  useEffect(() => {
    resetError();
  }, [resetError]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const newUser = await handleRegister(form);
      navigate(roleHome[newUser.role], { replace: true });
    } catch {
      // the message is already in the store and shown below
    }
  };

  if (!isChecking && user) {
    return <Navigate to={roleHome[user.role]} replace />;
  }

  return (
    <AuthLayout>
      <h1 className="text-3xl font-semibold tracking-tight text-ink">Create your account</h1>
      <p className="mt-2 text-sm text-ink-muted">
        Your admin can change your role after you join.
      </p>

      <form onSubmit={handleSubmit} className="mt-9 flex flex-col gap-5">
        <Input
          id="reg-name"
          label="Full name"
          type="text"
          name="name"
          value={form.name}
          onChange={handleChange}
          placeholder="Ravi Kumar"
          minLength={3}
          required
        />
        <Input
          id="reg-email"
          label="Email"
          type="email"
          name="email"
          value={form.email}
          onChange={handleChange}
          placeholder="you@company.com"
          required
        />
        <Input
          id="reg-contact"
          label="Phone number"
          type="tel"
          name="contact"
          value={form.contact}
          onChange={handleChange}
          placeholder="9876543210"
          inputMode="numeric"
          pattern="\d{10}"
          maxLength={10}
          title="Enter a 10 digit phone number"
          required
        />
        <Input
          id="reg-password"
          label="Password"
          type="password"
          name="password"
          value={form.password}
          onChange={handleChange}
          placeholder="At least 6 characters"
          minLength={6}
          required
        />

        {error && <p className="rounded-lg bg-bad-bg px-3.5 py-2.5 text-sm text-bad">{error}</p>}

        <Button type="submit" loading={loading} className="mt-1">
          Create account
        </Button>

        <p className="text-center text-sm text-ink-muted">
          Already have an account?{" "}
          <Link to="/login" className="font-medium text-primary hover:underline">
            Sign in
          </Link>
        </p>
      </form>
    </AuthLayout>
  );
};

export default Register;