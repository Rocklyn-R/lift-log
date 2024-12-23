import { CircularProgressbar, buildStyles } from "react-circular-progressbar";
import "react-circular-progressbar/dist/styles.css";
import { IoPlay } from "react-icons/io5";
import { IoPause } from "react-icons/io5";
import { IoStop } from "react-icons/io5";
import { useState, useEffect, useCallback } from "react";
import { BsFillSkipEndFill } from "react-icons/bs";
import { MdOutlineEdit } from "react-icons/md";
import { LuTimer } from "react-icons/lu";
import { EditTimer } from "./EditTimer/EditTimer";
import { useDispatch, useSelector } from "react-redux";
import { selectHours, playTimer, pauseTimer, resetTimer, tick, selectMinutes, selectSeconds, selectSecondsLeft, selectTimerPaused } from "../../../redux-store/TimeSlice";

let intervalId: any = null;



export const Timer = () => {
    const isPaused = useSelector(selectTimerPaused);
   

    const hours = useSelector(selectHours);
    const minutes = useSelector(selectMinutes);
    const seconds = useSelector(selectSeconds);
    const [showEditTimer, setShowEditTimer] = useState(
        hours === 0 && minutes === 0 && seconds === 0
    );
    const secondsLeft = useSelector(selectSecondsLeft);
    const dispatch = useDispatch();

  
    const startTimer = useCallback(() => {
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
    }, [isPaused]);

    useEffect(() => {
        if (!isPaused) {
            clearInterval(intervalId);
            startTimer();
            console.log("this")
        }
    }, [isPaused, startTimer])

  
    const pause = async () => {
        dispatch(pauseTimer());
    };



    const play = () => {
        dispatch(playTimer());
        startTimer();
    }

    const reset = async () => {
        dispatch(resetTimer());
    }

    const totalSeconds = (secondsLeft / (hours * 3600 + minutes * 60 + seconds))
    const percentage = (secondsLeft / totalSeconds) * 100;

    const formatTime = () => {
        const hrs = Math.floor(secondsLeft / 3600);
        const mins = Math.floor((secondsLeft % 3600) / 60);
        const secs = secondsLeft % 60;
    
        // If there are no hours, return minutes and seconds in the format "mm:ss" or "ss"
        if (hrs === 0) {
            if (mins === 0) {
                return `${secs}`;  // Only display seconds if no minutes or hours
            }
            return `${mins}:${secs < 10 ? "0" : ""}${secs}`;  // "mm:ss"
        }
    
        // If there are hours, format the string as "hh:mm:ss"
        return `${hrs}:${mins < 10 ? "0" : ""}${mins}:${secs < 10 ? "0" : ""}${secs}`;
    };

    return (
        <div className="h-[70vh] justify-center w-full flex flex-col items-center relative">
            {showEditTimer ? (
                <EditTimer setShowEditTimer={setShowEditTimer} play={play} />
            ) : (
                <>
                    <div className="h-fit w-1/3 flex items-start">
                        <CircularProgressbar
                            value={percentage}
                            text={formatTime()}
                            styles={buildStyles({
                                textColor: "#2C2C64",
                                pathColor: "#2C2C64",
                                trailColor: "#BDBCDC"
                            })}
                        />
                    </div>

                    <button
                        onClick={() => setShowEditTimer(true)}
                        className="absolute right-1/4 top-10 hover:bg-lightPurple hover:shadow-lg p-2 rounded-full"
                    >
                        <LuTimer className="text-2xl text-darkestPurple" />
                    </button>

                    <div className="flex space-between mt-4 text-darkPurple">
                        <button
                            onClick={reset}
                            className=""
                        >
                            <IoStop className="text-5xl" />
                        </button>
                        {isPaused && (
                            <button onClick={play} className="">
                                <IoPlay className="text-5xl" />
                            </button>
                        )}
                        {!isPaused && (
                            <button onClick={pause} className="">
                                <IoPause className="text-4xl" />
                            </button>
                        )}
                    </div>
                </>
            )}
        </div>
    );
};
