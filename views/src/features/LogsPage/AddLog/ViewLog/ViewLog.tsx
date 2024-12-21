import { useState } from "react"
import { LogForm } from "./LogForm/LogForm";
import { History } from "./History/History";



export const ViewLog = () => {
    const [activeTab, setActiveTab] = useState('track');

    const handleShowTrack = () => setActiveTab('track');
    const handleShowHistory = () => setActiveTab('history');

    return (
        <div className="">
            <div className="relative flex bg-darkestPurple h-fit">
                {/* Tabs */}
                <button
                    onClick={handleShowTrack}
                    className={`p-2 flex w-1/2 justify-center text-sm font-semibold relative ${activeTab === 'track' ? 'text-lightestPurple' : 'text-lightPurple'
                        }`}
                >
                    TRACK
                </button>
                <div className="w-px bg-lightPurple my-2" /> {/* Vertical divider */}
                <button
                    onClick={handleShowHistory}
                    className={`p-2 flex w-1/2 justify-center text-sm font-semibold relative ${activeTab === 'history' ? 'text-lightestPurple' : 'text-lightPurple'
                        }`}
                >
                    HISTORY
                </button>

                {/* Sliding underline */}
                <div
                    className={`absolute bottom-0 h-1 bg-lightPurple transition-all duration-300 ease-in-out`}
                    style={{
                        width: `50%`, // Subtract divider width
                        transform: activeTab === 'track' ? 'translateX(0)' : 'translateX(100%)',
                    }}
                />
            </div>
            {activeTab === "track" && (
                <LogForm
                />
            )}
            {activeTab === "history" && (
                <History />
            )}
        </div>
    );
}