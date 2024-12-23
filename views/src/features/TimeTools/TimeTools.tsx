import { Header } from "../../components/Header";
import { useState, useEffect } from "react";
import { Timer } from "./Timer/Timer";
import { getTimer } from "../../api/timers";
import { selectTimerLoading, setTimerTime } from "../../redux-store/TimeSlice";
import { useDispatch } from "react-redux";
import { useSelector } from "react-redux";
import { Loading } from "../../components/Loading";

export const TimeTools = () => {
    const [activeTab, setActiveTab] = useState<"Timer" | "Stopwatch">("Timer");
    const dispatch = useDispatch();
    const isLoading = useSelector(selectTimerLoading);

    if (isLoading) {
        return (
          <div className="flex flex-col items-center justify-center h-screen bg-lightestPurple">
            <Loading />
          </div>
        );
      }
    return (
        <div className="xl:pl-0 pl-16">
            <Header text="Time Tools" />

            <div className="">
                {activeTab === "Timer" ? (
                    <Timer />
                ) : (
                    <div className="p-4 bg-lightPurple rounded shadow">Stopwatch Component Here</div>
                )}
            </div>
            <div className="flex justify-center mt-4 space-x-4">
                <button
                    className={`px-4 py-2 text-lg rounded-lg ${activeTab === "Timer" ? "bg-darkestPurple text-lightestPurple shadow-md" : "bg-lightPurple text-darkPurple"
                        } hover:shadow-lg transition`}
                    onClick={() => setActiveTab("Timer")}
                >
                    Timer
                </button>
                <button
                    className={`px-4 py-2 text-lg rounded-lg ${activeTab === "Stopwatch" ? "bg-darkestPurple text-lightestPurple shadow-md" : "bg-lightPurple text-darkPurple"
                        } hover:shadow-lg transition`}
                    onClick={() => setActiveTab("Stopwatch")}
                >
                    Stopwatch
                </button>
            </div>
        </div>
    );
}