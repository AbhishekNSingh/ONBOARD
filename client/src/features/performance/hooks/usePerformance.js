import { useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchMyRatings } from "../state/performance.slice";
import { postRating } from "../services/performance.api";
import { getErrorMessage } from "../../shared/utils/getErrorMessage";

export const usePerformance = () => {
  const dispatch = useDispatch();
  const { myRatings, loading, error } = useSelector((s) => s.performance);

  const loadMyRatings = useCallback(() => dispatch(fetchMyRatings()), [dispatch]);

  // throws the server's sentence on failure, so the form can show it
  const giveRating = useCallback(async (body) => {
    try {
      const data = await postRating(body);
      return data.message;
    } catch (err) {
      throw getErrorMessage(err);
    }
  }, []);

  return { myRatings, loading, error, loadMyRatings, giveRating };
};