import { WifiOff } from "lucide-react";
import Button from "./Button";

const ConnectionError = ({ onRetry }) => (
  <div className="flex min-h-screen flex-col items-center justify-center gap-4 bg-canvas px-6 text-center">
    <div className="flex h-12 w-12 items-center justify-center rounded-full bg-soft text-primary">
      <WifiOff size={22} aria-hidden="true" />
    </div>
    <h1 className="text-xl font-semibold text-ink">Can't reach the server</h1>
    <p className="max-w-sm text-sm text-ink-muted">
      Check your connection, or try again in a moment. You're still signed in.
    </p>
    <div className="w-40">
      <Button onClick={onRetry}>Try again</Button>
    </div>
  </div>
);

export default ConnectionError;