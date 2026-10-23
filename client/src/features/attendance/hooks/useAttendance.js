import { useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchTeam,
  markAttendance,
  fetchMyRecords,
  fetchEmployeeRecords,
  clearMarks,
  clearMarkError,
} from "../state/attendance.slice";

export const useAttendance = () => {
  const dispatch = useDispatch();
  const state = useSelector((s) => s.attendance);

  const loadTeam = useCallback(() => dispatch(fetchTeam()), [dispatch]);

  const mark = useCallback(
    (employeeId, date, status) =>
      dispatch(markAttendance({ employeeId, date, status })),
    [dispatch]
  );

  const loadMyRecords = useCallback(() => dispatch(fetchMyRecords()), [dispatch]);

  const loadEmployeeRecords = useCallback(
    (id, month) => dispatch(fetchEmployeeRecords({ id, month })),
    [dispatch]
  );

  const resetMarks = useCallback(() => dispatch(clearMarks()), [dispatch]);
  const resetMarkError = useCallback(() => dispatch(clearMarkError()), [dispatch]);

  return {
    ...state,
    loadTeam,
    mark,
    loadMyRecords,
    loadEmployeeRecords,
    resetMarks,
    resetMarkError,
  };
};