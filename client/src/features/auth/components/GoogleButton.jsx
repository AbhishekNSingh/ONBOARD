import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { GoogleLogin } from "@react-oauth/google";
import { useAuth } from "../hooks/useAuth";
import { roleHome } from "../utils/roleHome";

const GoogleButton = ({ text = "continue_with" }) => {
  const navigate = useNavigate();
  const mode = useSelector((state) => state.theme.mode);
  const { handleGoogleLogin } = useAuth();
  const [message, setMessage] = useState("");

  // Google signed the person in and gave us a token: send it to our server to check
  const onSuccess = async (response) => {
    setMessage("");
    try {
      const user = await handleGoogleLogin(response.credential);
      navigate(roleHome[user.role], { replace: true });
    } catch {
      // the server's message is already in the store and shown by the page
    }
  };

  return (
    <div className="flex flex-col items-center gap-2">
      <GoogleLogin
        onSuccess={onSuccess}
        onError={() => setMessage("Google sign-in didn't complete. Try again.")}
        theme={mode === "dark" ? "filled_black" : "outline"}
        text={text}
        shape="rectangular"
        size="large"
        width="300"
      />
      {message && <p className="text-xs text-bad">{message}</p>}
    </div>
  );
};

export default GoogleButton;