import { useState } from "react"
import { LogForm } from "./LogForm/LogForm";
import { MdArrowBackIos } from "react-icons/md";
import { History } from "./History/History";

interface ViewExerciseProps {
    source: "logs" | "library";
    handleNavigateBack?: () => void;
    action: "add" | "edit"
}


export const ViewExercise: React.FC<ViewExerciseProps> = ({ source, handleNavigateBack, action }) => {
    const [activeTab, setActiveTab] = useState('track');

    const handleShowTrack = () => setActiveTab('track');
    const handleShowHistory = () => setActiveTab('history');

    return (
        <div>
            <div className="relative flex bg-darkestPurple">
                {/* Tabs */}
                {source === "logs" && action === "add" && (
                    <button
                        onClick={handleNavigateBack}
                        className="absolute top-14 left-6 hover:cursor-pointer z-50"
                    >
                        <MdArrowBackIos className="text-3xl text-darkestPurple hover:text-darkPurple" />
                    </button>
                )}


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
                    source="add"
                />
            )}
            {activeTab === "history" && (
                <History />
            )}
        </div>
    );
}