import { useState, useEffect } from "react"
import { LogForm } from "./LogForm/LogForm";
import { History } from "./History/History";
import { useSelector } from "react-redux";
import { selectSelectedExercise, selectWorkout, setExerciseHistory } from "../../../../redux-store/LogsSlice";
import { getExerciseHistory } from "../../../../api/logs";
import { useDispatch } from "react-redux";
import { Workout } from "../../../../types/types";


export const ViewLog = () => {
    const [activeTab, setActiveTab] = useState('track');
    const selectedExercise = useSelector(selectSelectedExercise);
    const dispatch = useDispatch();
    const handleShowTrack = () => setActiveTab('track');
    const handleShowHistory = () => setActiveTab('history');



    useEffect(() => {
        const fetchExerciseHistory = async () => {
            if (!selectedExercise) return;

            const historyResults = await getExerciseHistory(selectedExercise.exercise_id);
            if (historyResults) {
                const organizedExercises = historyResults.reduce((result: Workout[], set: any) => {
                    // Check if the date already exists in the result array
                    const existingExercise = result.find(
                        (exercise) => exercise.date === set.date
                    );

                    if (existingExercise) {
                        // Add the set to the existing exercise
                        existingExercise.sets.push({
                            weight: set.weight,
                            reps: set.reps,
                            set_number: set.set_number,
                            set_id: set.id,
                            pr: set.PR,
                            weight_lbs: set.weight_lbs
                        });
                    } else {
                        // Create a new exercise object
                        result.unshift({
                            date: set.date,
                            exercise_id: set.exercise_id,
                            exercise_name: set.exercise_name,
                            exercise_order: set.exercise_order,
                            sets: [
                                {
                                    weight: set.weight,
                                    reps: set.reps,
                                    set_number: set.set_number,
                                    set_id: set.id,
                                    pr: set.PR,
                                    weight_lbs: set.weight_lbs
                                },
                            ],
                        });
                    }

                    return result;
                }, []);

                  // Sort by date in descending order (most recent first)
            organizedExercises.sort((a: Workout, b: Workout) => new Date(b.date).getTime() - new Date(a.date).getTime());

                // Dispatch the organized history to Redux
                dispatch(setExerciseHistory(organizedExercises));
            }
        };
        fetchExerciseHistory();
        return () => {
            dispatch(setExerciseHistory([]))
        }

    }, [selectedExercise, dispatch]);

    return (
        <div className="dark:bg-darkestPurple">
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