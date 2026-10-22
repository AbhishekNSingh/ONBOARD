import { useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchMyLeaves,
  submitLeave,
  clearSubmitError,
  fetchPendingLeaves,
  decideLeave,
  clearDecideError,
} from "../state/leave.slice";

export const useLeaves = () => {
  const dispatch = useDispatch();
  const {
    myLeaves,
    loading,
    error,
    submitting,
    submitError,
    pendingLeaves,
    pendingLoading,
    pendingError,
    decidingId,
    decideError,
  } = useSelector((state) => state.leaves);

  const loadMyLeaves = useCallback(() => dispatch(fetchMyLeaves()), [dispatch]);

  const requestLeave = useCallback(
    (leaveData) => dispatch(submitLeave(leaveData)).unwrap(),
    [dispatch]
  );

  const loadPendingLeaves = useCallback(
    () => dispatch(fetchPendingLeaves()),
    [dispatch]
  );

  const decide = useCallback(
    (id, status) => dispatch(decideLeave({ id, status })),
    [dispatch]
  );

  const resetSubmitError = useCallback(
    () => dispatch(clearSubmitError()),
    [dispatch]
  );

  const resetDecideError = useCallback(
    () => dispatch(clearDecideError()),
    [dispatch]
  );

  return {
    myLeaves,
    loading,
    error,
    submitting,
    submitError,
    pendingLeaves,
    pendingLoading,
    pendingError,
    decidingId,
    decideError,
    loadMyLeaves,
    requestLeave,
    loadPendingLeaves,
    decide,
    resetSubmitError,
    resetDecideError,
  };
};