import { CircularProgressbar, buildStyles } from "react-circular-progressbar";
import "react-circular-progressbar/dist/styles.css";
import { useState, useEffect, useCallback } from "react";
import { LuTimer } from "react-icons/lu";
import { EditTimer } from "./EditTimer/EditTimer";
import { useDispatch, useSelector } from "react-redux";
import { selectHours, playTimer, pauseTimer, resetTimer, tick, selectMinutes, selectSeconds, selectSecondsLeft, selectTimerRunning } from "../../../redux-store/TimeSlice";
import { playPauseTimer } from "../../../api/timers";
import { Button } from "../../../components/Button";
import { selectTheme } from "../../../redux-store/SettingsSlice";

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
    const theme = useSelector(selectTheme);
    const dark = theme === "Dark";

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
    /*
        darkestPurple: '#07043d',
        darkPurple: '#282b54',
        lightPurple: '#BDBCDC',
        lightestPurple: '#ddddf7',
        mediumPurple: '#454399',
        whitePurple: '#DDDAF3' #0c0121*/
    return (
        <div className="h-[60vh] justify-center w-full flex flex-col items-center relative">
            {showEditTimer ? (
                <EditTimer setShowEditTimer={setShowEditTimer} play={play} />
            ) : (
                <>
                <div className="flex items-start z-20 relative">
                    {/* Wrapper div for background color */}
                    <div
                        className="absolute inset-0 rounded-full border-2 dark:border-mediumPurple bg-[#BDBCDC] dark:bg-[#BDBCDC] " // background color inside circle
                    ></div>
                    <div className="flex items-start z-20 border-2 border-mediumPurple rounded-full font-robotoMono font-bold">
                        <CircularProgressbar
                            value={percentage}
                            text={formatTime()}
                            styles={buildStyles({
                                textColor: "#282b54",
                                pathColor: dark ? "#282b54" : "#0c0121",
                                trailColor: dark ? "#ddddf7" : "#fffcff",
                                textSize: "16px",
                                //strokeLinecap: '#DDDAF3'
                            })}
                        />
                    </div>
                </div>

                    <button
                        onClick={() => {
                            setShowEditTimer(true)
                            pauseTimer();
                        }}
                        className="xsh-sm:top-3 xsh-sm:right-3 xsh-sm:text-2xl dark:bg-darkPurple dark:border-2 dark:border-mediumPurple dark:hover:bg-lightestPurple dark:hover:text-darkestPurple text-4xl text-lightestPurple bg-darkestPurple border-mediumPurple dark:text-lightestPurple absolute right-5 sm:right-1/6 md:right-1/4 top-8 md:top-10 hover:bg-darkPurple hover:shadow-lg p-2 rounded-full"
                    >
                        <LuTimer className="" />
                    </button>

                    <div className="mt-4 lg:w-1/2 md:w-2/3 w-full flex justify-evenly px-4">
                         <Button width="w-24" onClick={reset} type="button">
                            Reset
                        </Button> 
                        {isRunning ? (
                               <Button width="w-24" onClick={pause} type="button">
                            Pause
                        </Button> 
                        ) : (secondsLeft === 0 ? (
                           <Button width="w-24" onClick={play} type="button">
                            Start
                        </Button>  
                        ) : <Button width="w-24" type="button" onClick={play}>Resume</Button>)}
                       
                    
                      
                    </div>
                </>
            )}
        </div>
    );
};
