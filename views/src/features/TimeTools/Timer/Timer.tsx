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
import { selectHours, playTimer, pauseTimer, resetTimer, tick, selectMinutes, selectSeconds, selectSecondsLeft, selectTimerRunning } from "../../../redux-store/TimeSlice";
import { playPauseTimer } from "../../../api/timers";

let intervalId: any = null;



export const Timer = () => {
    const isRunning = useSelector(selectTimerRunning);
    const hours = useSelector(selectHours);
    const minutes = useSelector(selectMinutes);
    const seconds = useSelector(selectSeconds);
    const [showEditTimer, setShowEditTimer] = useState(
        hours === 0 && minutes === 0 && seconds === 0
    );
    const secondsLeft = useSelector(selectSecondsLeft);
    const dispatch = useDispatch();

  /*  useEffect(() => {
        // Save the remaining time to localStorage when the tab is about to unload
        const handleBeforeUnload = () => {
          if (secondsLeft > 0) {
            const endTime = Math.floor(Date.now() / 1000) + secondsLeft;
            localStorage.setItem('endTime', endTime.toString());
          }
        };
    
        window.addEventListener('beforeunload', handleBeforeUnload);
    
        return () => {
          window.removeEventListener('beforeunload', handleBeforeUnload);
        };
      }, [secondsLeft]);*/


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

        if (!isRunning) {
            clearInterval(intervalId);
        }
    }, [isRunning]);

    useEffect(() => {
        if (isRunning) {
            clearInterval(intervalId);
            startTimer();
            console.log("this")
        }
    }, [isRunning, startTimer])


    const pause = async () => {
        dispatch(pauseTimer());
        await playPauseTimer(false);
    };



    const play = async () => {
        dispatch(playTimer());
        startTimer();
        await playPauseTimer(true)
    }

    const reset = async () => {
        dispatch(resetTimer());
        await playPauseTimer(false);
    }

    const totalTimeInSeconds = (hours * 3600) + (minutes * 60) + seconds;
    const percentage = (secondsLeft / totalTimeInSeconds) * 100;

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
    /*darkestPurple: '#001247',
            darkPurple: '#2C2C64',
            lightPurple: '#BDBCDC',
            lightestPurple: '#ddddf7',
            mediumPurple: '#454399',
            whitePurple: '#DDDAF3' */
    return (
        <div className="h-[70vh] justify-center w-full flex flex-col items-center relative">
            {showEditTimer ? (
                <EditTimer setShowEditTimer={setShowEditTimer} play={play} />
            ) : (
                <>
                <div className="flex items-start z-50 relative w-[60vh] h-[60vh] max-w-[350px] max-h-[350px]">
                    {/* Wrapper div for background color */}
                    <div
                        className="absolute inset-0 rounded-full bg-[#BDBCDC]" // background color inside circle
                    ></div>
                    <div className="flex items-start z-50 w-[60vh] h-[60vh] max-w-[350px] max-h-[350px]">
                        <CircularProgressbar
                            value={percentage}
                            text={formatTime()}
                            styles={buildStyles({
                                textColor: "#2C2C64",
                                pathColor: "#001247",
                                trailColor: "#BDBCDC",
                                backgroundColor: "#BDBCDC"
                            })}
                        />
                    </div>
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
                        {!isRunning && (
                            <button onClick={play} className="">
                                <IoPlay className="text-5xl" />
                            </button>
                        )}
                        {isRunning && (
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
