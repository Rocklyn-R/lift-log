import { useState, useEffect, useRef } from "react";
import { useDispatch } from "react-redux";
import { useSelector } from "react-redux";
import { Button } from "../../../components/Button";
import { pauseStopwatch, selectElapsedTime, selectStopwatchRunning, selectStopwatchStartTime, setElapsedStopwatchTime, startStopwatch } from "../../../redux-store/TimeSlice";

export const Stopwatch = () => {
    const isRunning = useSelector(selectStopwatchRunning);
    const elapsedTime = useSelector(selectElapsedTime);
    const dispatch = useDispatch();
    const intervalIdRef = useRef<NodeJS.Timeout | null>(null);
    //const startTimeRef = useRef(0);
    const startTime = useSelector(selectStopwatchStartTime);

    useEffect(() => {
        if (isRunning) {
            intervalIdRef.current = setInterval(() => {
                dispatch(setElapsedStopwatchTime(Date.now() - startTime))
            }, 10)
        }

        return () => {
            if (intervalIdRef.current !== null) {
                clearInterval(intervalIdRef.current);
            }
        };
    }, [isRunning]);

    /**    const startTimer = useCallback(() => {
        let iterations = 0;
        const maxIterations = secondsLeft;
        const id = setInterval(() => {
            if (iterations <= maxIterations) {
                dispatch(tick());
                iterations++;
            } else {
                intervalId = id;
            }
        }, 1000);
        intervalId = id;
        // eslint-disable-next-line
    }, [dispatch, secondsLeft]);

    useEffect(() => {

        if (isPaused) {
            clearInterval(intervalId);
        }
    }, [isPaused]); */

    const start = () => {
        dispatch(startStopwatch());
        //startTimeRef.current = Date.now() - elapsedTime;
    }

    const stop = () => {
        dispatch(pauseStopwatch());
    }

    const reset = () => {
        dispatch(setElapsedStopwatchTime(0));
        dispatch(pauseStopwatch());
    }

    const formatTime = () => {
        let hours = Math.floor(elapsedTime / (1000 * 60 * 60));
        let minutes = Math.floor(elapsedTime / (1000 * 60 * 60) % 60);
        let seconds = Math.floor(elapsedTime / (1000) % 60);
        let milliseconds = Math.floor(elapsedTime % (1000) / 10);
        // Convert numbers to zero-padded strings
        const paddedHours = String(hours).padStart(2, "0");
        const paddedMinutes = String(minutes).padStart(2, "0");
        const paddedSeconds = String(seconds).padStart(2, "0");
        const paddedMilliseconds = String(milliseconds).padStart(2, "0");

        return `${paddedMinutes}:${paddedSeconds}:${paddedMilliseconds}`;
    }

    return (
        <div className="h-[70vh] flex flex-col justify-center items-center text-darkestPurple w-full">
            {/* Centered Circle */}
            <div className="flex items-center justify-center h-fit w-full">
                <div className="flex flex-col items-center justify-center   w-[70vh] h-[70vh] max-w-[400px] max-h-[400px]">
                    {/* Timer */}
                    <div className="text-7xl font-bold mb-8 p-2 font-mono">
                        {formatTime()}
                    </div>
                    {/* Buttons */}
                    <div className="w-full flex justify-around px-4">
                        <Button onClick={start} type="button">
                            Start
                        </Button>
                        <Button onClick={stop} type="button">
                            Stop
                        </Button>
                        <Button onClick={reset} type="button">
                            Reset
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    );
}