import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import { roleHome } from "../utils/roleHome";
import PageLoader from "../../shared/components/PageLoader";
import ConnectionError from "../../shared/components/ConnectionError";

const Protected = ({ roles }) => {
  const { user, isChecking, serverError, checkAuth } = useAuth();

  // 1. still asking the backend who you are
  if (isChecking) {
    return <PageLoader />;
  }

  // 2. we don't know who you are, and the server isn't answering
  if (!user && serverError) {
    return <ConnectionError onRetry={checkAuth} />;
  }

  // 3. the server answered: nobody is logged in
  if (!user) {
    return <Navigate to="/login" replace />;
  }

  // 4. logged in, but this role isn't allowed here
  if (roles && !roles.includes(user.role)) {
    return <Navigate to={roleHome[user.role]} replace />;
  }

  // 5. all good
  return <Outlet />;
};

export default Protected;