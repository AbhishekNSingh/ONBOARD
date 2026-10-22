import { useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchUsers, changeUserRole, clearActionError } from "../state/user.slice";

export const useUsers = () => {
  const dispatch = useDispatch();
  const { users, loading, error, updatingId, actionError } = useSelector(
    (state) => state.users
  );

  const loadUsers = useCallback(() => dispatch(fetchUsers()), [dispatch]);

  const changeRole = useCallback(
    (id, role) => dispatch(changeUserRole({ id, role })).unwrap(),
    [dispatch]
  );

  const resetActionError = useCallback(
    () => dispatch(clearActionError()),
    [dispatch]
  );

  return {
    users,
    loading,
    error,
    updatingId,
    actionError,
    loadUsers,
    changeRole,
    resetActionError,
  };
};