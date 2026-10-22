import { useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchMyLeaves, submitLeave, clearSubmitError } from "../state/leave.slice";

export const useLeaves = () => {
  const dispatch = useDispatch();
  const { myLeaves, loading, error, submitting, submitError } = useSelector(
    (state) => state.leaves
  );

  const loadMyLeaves = useCallback(() => dispatch(fetchMyLeaves()), [dispatch]);

  const requestLeave = useCallback(
    (leaveData) => dispatch(submitLeave(leaveData)).unwrap(),
    [dispatch]
  );

  const resetSubmitError = useCallback(
    () => dispatch(clearSubmitError()),
    [dispatch]
  );

  return {
    myLeaves,
    loading,
    error,
    submitting,
    submitError,
    loadMyLeaves,
    requestLeave,
    resetSubmitError,
  };
};