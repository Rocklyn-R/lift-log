import { useState, useEffect, useRef } from "react";
import { Button } from "../../../components/Button";

export const Stopwatch = () => {
    const [isRunning, setIsRunning] = useState(false);
    const [elapsedTime, setElapsedTime] = useState(0);
    const intervalIdRef = useRef<NodeJS.Timeout | null>(null);
    const startTimeRef = useRef(0);

    useEffect(() => {
        if (isRunning) {
            intervalIdRef.current = setInterval(() => {
                setElapsedTime(Date.now() - startTimeRef.current)
            }, 10)
        }

        return () => {
            if (intervalIdRef.current !== null) {
                clearInterval(intervalIdRef.current);
            }
        };
    }, [isRunning]);

    const start = () => {
        setIsRunning(true);
        startTimeRef.current = Date.now() - elapsedTime;
    }

    const stop = () => {
        setIsRunning(false);
    }

    const reset = () => {
        setElapsedTime(0);
        setIsRunning(false);
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
                <div className="flex flex-col items-center justify-center bg-lightPurple border-8 border-darkPurple rounded-full w-[70vh] h-[70vh] max-w-[400px] max-h-[400px]">
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