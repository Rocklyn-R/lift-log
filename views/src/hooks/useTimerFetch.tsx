import { useEffect } from "react";
import { getTimer } from "../api/timers";
import { useDispatch } from "react-redux";
import { setTimerLoaded, setTimerTime } from "../redux-store/TimeSlice";
import { useSelector } from "react-redux";
import { selectIsAuthenticated } from "../redux-store/UserSlice";

export const useTimerFetch = () => {
    const dispatch = useDispatch();
    const isAuthenticated = useSelector(selectIsAuthenticated);

    useEffect(() => {
        const fetchTimer = async () => {
            const timerResult = await getTimer();
            if (timerResult.length > 0) {
                const { hours, minutes, seconds, seconds_left } = timerResult[0];
                dispatch(setTimerTime({hours, minutes, seconds, seconds_left}))
            } else {
                dispatch(setTimerLoaded());
            }
        }
         if (isAuthenticated) {
            fetchTimer();
        }
    }, [isAuthenticated, dispatch]);
}