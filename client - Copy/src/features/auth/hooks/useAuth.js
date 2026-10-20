import { useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchCurrentUser,
  login,
  register,
  logout,
  clearError,
} from "../state/auth.slice";


export const useAuth = () => {
    const dispatch = useDispatch();

    const {user,loading,isChecking,error} = useSelector((state) => state.auth);
    

    const handleLogin = useCallback(
        (credentials) => dispatch(login(credentials)).unwrap(),
        [dispatch]
    )

    const handleRegister = useCallback(
        (formData) => dispatch(register(formData)).unwrap(),
        [dispatch]
    )

    const handleLogout = useCallback(
        () => dispatch(logout()).unwrap(),
        [dispatch]
    )
    const checkAuth = useCallback(async () => {
  try {
    await dispatch(fetchCurrentUser()).unwrap();
  } catch {
    // 
  }
}, [dispatch]);
    const resetError = useCallback(
        () => dispatch(clearError()),
        [dispatch]
    )

    return {
    user,
    isAuthenticated: Boolean(user),
    loading,
    isChecking,
    error,
    handleLogin,
    handleRegister, 
    handleLogout, 
    checkAuth, 
    resetError
  };

}