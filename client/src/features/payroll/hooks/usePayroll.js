import { useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchMyPayroll,
  fetchEmployeePayroll,
  giveBonus,
  giveAdvance,
  makePayment,
} from "../state/payroll.slice";

export const usePayroll = () => {
  const dispatch = useDispatch();
  const state = useSelector((s) => s.payroll);

  const loadMyPayroll = useCallback(
    (month) => dispatch(fetchMyPayroll(month)),
    [dispatch]
  );

  const loadEmployeePayroll = useCallback(
    (id, month) => dispatch(fetchEmployeePayroll({ id, month })),
    [dispatch]
  );

  // each of these throws the server's sentence on failure, so a form can show it
  const addBonus = useCallback((body) => dispatch(giveBonus(body)).unwrap(), [dispatch]);
  const addAdvance = useCallback((body) => dispatch(giveAdvance(body)).unwrap(), [dispatch]);
  const addPayment = useCallback((body) => dispatch(makePayment(body)).unwrap(), [dispatch]);

  return {
    ...state,
    loadMyPayroll,
    loadEmployeePayroll,
    addBonus,
    addAdvance,
    addPayment,
  };
};