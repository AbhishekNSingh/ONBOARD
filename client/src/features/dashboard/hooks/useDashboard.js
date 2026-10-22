import { useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchDashboard } from "../state/dashboard.slice";

export const useDashboard = () => {
  const dispatch = useDispatch();
  const { summary, loading, error } = useSelector((state) => state.dashboard);

  const loadDashboard = useCallback(
    (role) => dispatch(fetchDashboard(role)),
    [dispatch]
  );

  return { summary, loading, error, loadDashboard };
};