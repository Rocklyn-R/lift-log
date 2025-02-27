import { Header } from "../../components/Header";
import { useState, useEffect } from "react";
import { Timer } from "./Timer/Timer";
import { getTimer } from "../../api/timers";
import { selectTimerLoading, setTimerTime } from "../../redux-store/TimeSlice";
import { useDispatch } from "react-redux";
import { useSelector } from "react-redux";
import { Loading } from "../../components/Loading";
import { Stopwatch } from "./Stopwatch/Stopwatch";

export const TimeTools = () => {
    const [activeTab, setActiveTab] = useState<"Timer" | "Stopwatch">("Timer");
    const isLoading = useSelector(selectTimerLoading);


    return (
        <div className="xl:pl-0 pl-16">
            <Header text="Time Tools" />
            {isLoading ? (
                <div className="flex flex-col items-center justify-center h-screen dark:bg-darkestPurple bg-lightestPurple">
                    <Loading />
                </div>
            ) : (
                <>

                    <div className="flex flex-col items-center w-full">
                        {activeTab === "Timer" ? (
                            <Timer />
                        ) : (
                            <Stopwatch />
                        )}
                    </div>
                    <div className="flex justify-center mt-4 space-x-4">
                        <button
                            className={`px-4 py-2 text-lg rounded-lg ${activeTab === "Timer" ? "dark:border-2 dark:bg-lightestPurple dark:text-darkestPurple bg-darkestPurple text-lightestPurple shadow-md border-2 border-transparent" : "dark:border-2 dark:border-mediumPurple dark:text-lightestPurple dark:bg-darkPurple text-darkPurple dark:hover:bg-lightestPurple dark:hover:text-darkestPurple bg-whitestPurple border-2 hover:bg-lightPurple border-mediumPurple"
                                } font-semibold hover:shadow-lg transition`}
                            onClick={() => setActiveTab("Timer")}
                        >
                            Timer
                        </button>
                        <button
                            className={`px-4 py-2 text-lg rounded-lg ${activeTab === "Stopwatch" ? "dark:border-2 dark:bg-lightestPurple dark:text-darkestPurple bg-darkestPurple text-lightestPurple shadow-md border-2 border-transparent" : "dark:border-2 dark:border-mediumPurple dark:bg-darkPurple dark:text-lightestPurple bg-whitestPurple text-darkPurple dark:hover:bg-lightestPurple dark:hover:text-darkestPurple border-2 hover:bg-lightPurple border-mediumPurple"
                                } font-semibold hover:shadow-lg transition`}
                            onClick={() => setActiveTab("Stopwatch")}
                        >
                            Stopwatch
                        </button>
                    </div>
                </>
            )}
        </div>
    );
}