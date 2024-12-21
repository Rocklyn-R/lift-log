import { Header } from "../../components/Header";
import { useState } from "react";
import { Timer } from "./Timer/Timer";

export const TimeTools = () => {
    const [activeTab, setActiveTab] = useState<"Timer" | "Stopwatch">("Timer");


    return (
        <div>
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