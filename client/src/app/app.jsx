import { useEffect } from "react";
import { useSelector } from "react-redux";
import { useAuth } from "../features/auth/hooks/useAuth";
import { RouterProvider } from "react-router-dom";
import { router } from "./app.routes";

const App = () => {
  const mode = useSelector((state) => state.theme.mode);
  const { checkAuth } = useAuth();

  // add or remove the "dark" class on <html> whenever the theme changes
  useEffect(() => {
    document.documentElement.classList.toggle("dark", mode === "dark");
  }, [mode]);

  useEffect(() => {
    checkAuth();
  }, [checkAuth]);


  // useEffect(() => {
  //   const onPageShow = (event) => {
  //     if (event.persisted) {
  //       checkAuth();
  //     }
  //   };

  //   window.addEventListener("pageshow", onPageShow);
  //   return () => window.removeEventListener("pageshow", onPageShow);
  // }, [checkAuth]);


  useEffect(() => {
    const onPageShow = (event) => {
      if (event.persisted) checkAuth();
    };

    const onVisible = () => {
      if (document.visibilityState === "visible") checkAuth();
    };

    window.addEventListener("pageshow", onPageShow);
    document.addEventListener("visibilitychange", onVisible);

    return () => {
      window.removeEventListener("pageshow", onPageShow);
      document.removeEventListener("visibilitychange", onVisible);
    };
  }, [checkAuth]);

  return <RouterProvider router={router} />;
};

export default App;
