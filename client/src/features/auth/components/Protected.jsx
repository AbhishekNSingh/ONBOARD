import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import { roleHome } from "../utils/roleHome";
import PageLoader from "../../shared/components/PageLoader";

const Protected = ({ roles }) => {
  const { user, isChecking } = useAuth();

  // 1. still asking the backend who you are
  if (isChecking) {
    return <PageLoader />;
  }

  // 2. nobody is logged in
  if (!user) {
    return <Navigate to="/login" replace />;
  }

  // 3. logged in, but this role isn't allowed here
  if (roles && !roles.includes(user.role)) {
    return <Navigate to={roleHome[user.role]} replace />;
  }

  // 4. all good: show the child page
  return <Outlet />;
};

export default Protected;