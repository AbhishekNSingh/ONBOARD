import { useNavigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import Button from "../../shared/components/Button";

const LogoutButton = () => {
  const navigate = useNavigate();
  const { handleLogout } = useAuth();

  const onLogout = async () => {
    try {
      await handleLogout();
    } finally {
      navigate("/login", { replace: true });
    }
  };

  return (
    <Button variant="ghost" onClick={onLogout}>
      Log out
    </Button>
  );
};

export default LogoutButton;