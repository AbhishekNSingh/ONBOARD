import { useEffect } from "react";
import { useState } from "react";
import Button from "./Button";
import Input from "./Input";
import { useDispatch, useSelector } from "react-redux";
import { toggleTheme } from "../state/theme.slice";
import { useAuth } from "../../auth/hooks/useAuth";

const TestPage = () => {
  const dispatch = useDispatch();
  const mode = useSelector((state) => state.theme.mode);
  const [text, setText] = useState("");

  const {
    user,
    isAuthenticated,
    loading,
    isChecking,
    error,
    checkAuth,
    handleLogin,
    handleLogout,
    resetError,
  } = useAuth();

  // runs once when the page opens
  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  const loginAsRavi = () =>
    handleLogin({ email: "ravi@test.com", password: "123456" }).catch(() => { });

  const loginWrongPassword = () =>
    handleLogin({ email: "ravi@test.com", password: "wrongpass" }).catch(() => { });

  return (
    <div className="min-h-screen px-8 py-16">
      <span className="font-serif text-sm uppercase tracking-[0.35em] text-gold">
        Onboard.
      </span>
      <h1 className="mt-6 font-serif text-5xl font-light">Auth test</h1>
      <div className="mt-4 h-px w-14 bg-gold" />

      <div className="mt-8 space-y-2 text-sm">
        <p>Checking: <b>{String(isChecking)}</b></p>
        <p>Logged in: <b>{String(isAuthenticated)}</b></p>
        <p>Loading: <b>{String(loading)}</b></p>
        <p>User: <b>{user ? `${user.name} (${user.role})` : "nobody"}</b></p>
        <p>Error: <b>{error || "none"}</b></p>
      </div>
      <div className="mt-10 max-w-sm space-y-6">
        <Input
          id="demo"
          label="Email Address"
          type="email"
          placeholder="hello@example.com"
          value={text}
          onChange={(e) => setText(e.target.value)}
          error={text === "bad" ? "That value is not allowed" : ""}
        />
        <Button>Primary button</Button>
        <Button variant="ghost">Ghost button</Button>
        <Button loading>Loading button</Button>
      </div>

      <div className="mt-8 flex flex-wrap gap-3">
        <button onClick={loginAsRavi} className="bg-ink px-6 py-3 text-xs uppercase tracking-[0.2em] text-surface hover:bg-gold hover:text-ink">
          Login (correct)
        </button>
        <button onClick={loginWrongPassword} className="bg-ink px-6 py-3 text-xs uppercase tracking-[0.2em] text-surface hover:bg-gold hover:text-ink">
          Login (wrong password)
        </button>
        <button onClick={() => handleLogout()} className="bg-ink px-6 py-3 text-xs uppercase tracking-[0.2em] text-surface hover:bg-gold hover:text-ink">
          Logout
        </button>
        <button onClick={resetError} className="border border-line px-6 py-3 text-xs uppercase tracking-[0.2em] hover:border-gold">
          Clear error
        </button>
        <button onClick={() => dispatch(toggleTheme())} className="border border-line px-6 py-3 text-xs uppercase tracking-[0.2em] hover:border-gold">
          Theme: {mode}
        </button>
      </div>
    </div>
  );
};

export default TestPage;