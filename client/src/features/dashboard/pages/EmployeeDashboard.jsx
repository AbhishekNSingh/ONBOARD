import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchDashboard } from "../state/dashboard.slice";

const EmployeeDashboard = () => {
  const dispatch = useDispatch();
  const dashboard = useSelector((state) => state.dashboard);

  useEffect(() => {
    dispatch(fetchDashboard("employee"));
  }, [dispatch]);

  useEffect(() => {
    console.log("DASHBOARD:", dashboard);
  }, [dashboard]);

  return <h1 className="text-2xl font-semibold text-ink">Dashboard (testing)</h1>;
};

export default EmployeeDashboard;