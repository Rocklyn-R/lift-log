import { useDispatch } from "react-redux";
import { useSelector } from "react-redux"
import { OverlayWindow } from "../../../../components/OverlayWIndow"
import { selectDateToView, selectWorkoutOnDate, setDateToView, setWorkoutOnDate, setWorkoutToCopy } from "../../../../redux-store/LogsSlice"
import { formatDateForHistory, formatNumber } from "../../../../utilities/utilities";
import { useWorkoutOnDayFetch } from "../../../../hooks/useWorkoutOnDayFetch";
import { Workout, Set } from "../../../../types/types";
import { MdArrowBackIos } from "react-icons/md";
import { Button } from "../../../../components/Button";
import { useState, useEffect } from "react";
import { CopyMessage } from "./CopyMessage/CopyMessage";
import { selectUnitSystem } from "../../../../redux-store/SettingsSlice";
import { Loading } from "../../../../components/Loading";

interface CopyWorkoutProps {
    setShowCalendar: (arg0: boolean) => void;
    setShowCopyDay: (arg0: boolean) => void;
    //setShowCopyMessage: (arg0: boolean) => void;
}

export const CopyWorkout: React.FC<CopyWorkoutProps> = ({ setShowCalendar, setShowCopyDay }) => {
    const [loading, setLoading] = useState(true);
    useWorkoutOnDayFetch(setLoading);

    const dateToCopy = useSelector(selectDateToView);
    const formattedDate = formatDateForHistory(dateToCopy);
    const dispatch = useDispatch();
    const workoutOnDate = useSelector(selectWorkoutOnDate);
    const [showCopyMessage, setShowCopyMessage] = useState(false);
    const unit_system = useSelector(selectUnitSystem);

    const handleCloseOverlay = () => {
        if (showCopyMessage) {
            setShowCopyMessage(false);
        } else {
            setShowCopyDay(false);
            dispatch(setDateToView(""));
            dispatch(setWorkoutOnDate([]));
        }

    }

    const handleNavigateBack = () => {
        setShowCalendar(true);
        handleCloseOverlay();
    }

    const [exercisesToCopy, setExercisesToCopy] = useState<Workout[]>(workoutOnDate);

    useEffect(() => {
        setExercisesToCopy(workoutOnDate);
    }, [workoutOnDate]);

    const checkForAllSetsChecked = (exercise: Workout) => {
        const matchingExercise = exercisesToCopy.find(item => item.exercise_id === exercise.exercise_id);
        if (!matchingExercise) {
            return false;
        }
        return exercise.sets.every(set =>
            matchingExercise.sets.some(matchingSet => matchingSet.set_id === set.set_id)
        );
    }

    const handleCheckExercise = (exercise: Workout) => {
        const checked = checkForAllSetsChecked(exercise);
        if (checked) {
            const filteredExercises = exercisesToCopy.filter(item => item.exercise_id !== exercise.exercise_id);
            setExercisesToCopy(filteredExercises);
        } else {
            const foundIndex = exercisesToCopy.findIndex(item => item.exercise_id === exercise.exercise_id);
            const comparisonIndex = workoutOnDate.findIndex(item => item.exercise_id === exercise.exercise_id);

            if (foundIndex !== -1 && comparisonIndex !== -1) {
                // Get sets from both arrays
                const copiedSets = exercisesToCopy[foundIndex].sets;
                const workoutSets = workoutOnDate[comparisonIndex].sets;

                // Find missing sets in exercisesToCopy
                const missingSets = workoutSets.filter(workoutSet =>
                    !copiedSets.some(copiedSet => copiedSet.set_id === workoutSet.set_id)
                );

                if (missingSets.length > 0) {
                    // Add missing sets to exercisesToCopy[foundIndex]
                    exercisesToCopy[foundIndex].sets = [...copiedSets, ...missingSets];

                    // Update the state to reflect the changes
                    setExercisesToCopy([...exercisesToCopy]);
                }
            }
            setExercisesToCopy([...exercisesToCopy, exercise]);
        }
    }

    const checkForSet = (exercise: Workout, set: Set) => {
        const foundIndex = exercisesToCopy.findIndex(item => item.exercise_id === exercise.exercise_id);
        if (foundIndex !== -1) {
            const foundSetIndex = exercisesToCopy[foundIndex].sets.findIndex(item => item.set_id === set.set_id);
            if (foundSetIndex !== -1) {
                return true;
            } else {
                return false;
            }
        } else {
            return false;
        }
    }

    const handleCheckSet = (exercise: Workout, set: Set) => {
        const checked = checkForSet(exercise, set);
        const foundIndex = exercisesToCopy.findIndex(item => item.exercise_id === exercise.exercise_id);
        if (checked) {
            if (foundIndex !== -1) {
                if (exercisesToCopy[foundIndex].sets.length > 1) {
                    const filteredSets = exercisesToCopy[foundIndex].sets.filter(item => item.set_id !== set.set_id);
                    const updatedExercise = {
                        ...exercisesToCopy[foundIndex],
                        sets: filteredSets
                    };
                    const updatedExercises = [...exercisesToCopy];
                    updatedExercises[foundIndex] = updatedExercise;
                    setExercisesToCopy(updatedExercises);
                } else {
                    const filteredExercises = exercisesToCopy.filter(item => item.exercise_id !== exercise.exercise_id);
                    setExercisesToCopy(filteredExercises);
                }
            }
        } else {
            if (foundIndex !== -1) {
                const updatedSets = [...exercisesToCopy[foundIndex].sets, set];
                const updatedExercise = {
                    ...exercisesToCopy[foundIndex],
                    sets: updatedSets
                };
                const updatedExercises = [...exercisesToCopy];
                updatedExercises[foundIndex] = updatedExercise;
                setExercisesToCopy(updatedExercises);
            } else {
                const updatedExercise = {
                    date: exercise.date,
                    exercise_id: exercise.exercise_id,
                    exercise_name: exercise.exercise_name,
                    exercise_order: exercise.exercise_order,
                    sets: [set]
                };
                const updatedExercises = [...exercisesToCopy, updatedExercise];
                setExercisesToCopy(updatedExercises);
            }
        }
    };


    const checkForAllChecked = () => {
        return workoutOnDate.every(item => {
            const matchingExercise = exercisesToCopy.find(exercise => exercise.exercise_id === item.exercise_id);
            return matchingExercise && matchingExercise.sets.length === item.sets.length;
        });
    }

    const handleCheckSelectAll = () => {
        const checked = checkForAllChecked();
        if (checked) {
            setExercisesToCopy([]);
        } else {
            setExercisesToCopy(workoutOnDate);
        }
    }


    const selectCopy = () => {
        setShowCopyMessage(true);

        // Step 1: Deep clone the exercisesToCopy array and its sets to avoid modifying the original state
        const clonedExercises = exercisesToCopy.map(exercise => ({
            ...exercise,
            sets: [...exercise.sets],
        }));

        // Step 2: Sort cloned exercises by exercise_order
        clonedExercises.sort((a, b) => a.exercise_order - b.exercise_order);

        // Step 3: Sort each exercise's sets by set_number
        clonedExercises.forEach(exercise => {
            exercise.sets.sort((a, b) => a.set_number - b.set_number);
        });

        // Step 4: Update state and dispatch the reordered set
        setExercisesToCopy(clonedExercises);
        dispatch(setWorkoutToCopy(clonedExercises));
    };


    return (
        <OverlayWindow
            headerText={`Copy Workout - ${formattedDate}`}
            onClose={handleCloseOverlay}
            className="phones:w-full xs:w-4/5 sm:w-3/5 md:w-1/2 lg:w-1/3 min-h-[45vh] max-h-[75vh]"
            className2={`min-h-[45vh] max-h-[65vh] ${workoutOnDate.length === 0 ? "flex items-center justify-center" : "flex flex-col justify-between"}`}
        >
            <button
                onClick={() => handleNavigateBack()}
                style={{ height: '0' }}
                className="absolute top-4 left-2 sm:left-4 z-50"
            ><MdArrowBackIos className="sm:text-2xl text-lightestPurple" /></button>
            {loading ? <div className="h-auto w-full flex flex-grow justify-center items-center"><Loading /> </div> : (
                <>
                    {workoutOnDate.length > 0 ? (
                        <div className="max-h-[50vh] overflow-y-auto">
                            <div className="p-2 flex justify-between">
                                <span>Select All</span>
                                <input
                                    onChange={() => handleCheckSelectAll()}
                                    checked={checkForAllChecked()}
                                    type="checkbox"
                                    id="custom-checkbox1"
                                    className="styled-checkbox mx-3"
                                />
                            </div>
                            {workoutOnDate.map((exercise, index) => (
                                <div key={index} className="w-full">
                                    {exercise.sets.length > 0 && (
                                        <>
                                            <div className="bg-lightPurple p-2 flex items-center w-full justify-between border-b-2 border-lightPurple">
                                                <h3 className="font-semibold text-lg">{exercise.exercise_name}</h3>
                                                <input
                                                    checked={checkForAllSetsChecked(exercise)}
                                                    onChange={() => handleCheckExercise(exercise)}
                                                    type="checkbox"
                                                    id="custom-checkbox2"
                                                    className="styled-checkbox mx-3"
                                                />
                                            </div>

                                            <div className="p-3">
                                                {exercise.sets.map((set, index) => (
                                                    <div key={index} className="p-2 flex justify-end space-x-6 text-center items-center">
                                                        {unit_system === "metric" ? (
                                                            <span className="flex justify-end">{formatNumber(set.weight)} kgs</span>
                                                        ) : (
                                                            <span className="flex justify-end">{formatNumber(set.weight_lbs)} lbs</span>
                                                        )}
                                                        <div className="flex justify-end items-center space-x-4">
                                                            <span>{set.reps} reps</span>
                                                            <input
                                                                onChange={() => handleCheckSet(exercise, set)}
                                                                checked={checkForSet(exercise, set)}
                                                                type="checkbox"
                                                                id="custom-checkbox3"
                                                                className="styled-checkbox"
                                                            />
                                                        </div>

                                                    </div>
                                                ))}
                                            </div>
                                        </>
                                    )}
                                </div>
                            ))}
                        </div>

                    )
                        : <span>You haven't created a workout log for this day.</span>}

                    <div className="w-full flex justify-center space-x-4 p-4">
                        <Button
                            type="button"
                            onClick={handleCloseOverlay}

                        >
                            Cancel
                        </Button>
                        <Button
                            type="button"
                            onClick={() => selectCopy()}
                        >
                            Copy
                        </Button>
                    </div>
                    {showCopyMessage && (

                        <CopyMessage
                            setShowCopyMessage={setShowCopyMessage}
                            setShowCopyDay={setShowCopyDay}
                        />
                    )}
                </>)}

        </OverlayWindow>
    )
}