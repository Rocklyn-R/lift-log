import e from "express";
import { useState } from "react";
import { FaPlus, FaMinus } from "react-icons/fa6";
import { MdArrowBackIos } from "react-icons/md";
import { useSelector } from "react-redux";
import { useDispatch } from "react-redux";
import { addSetToLog } from "../../../../api/logs";
import { Button } from "../../../../components/Button";
import { addExerciseToWorkout, addToSetList, selectSelectedDate, selectSelectedExercise, selectSetList, selectWorkout } from "../../../../redux-store/LogsSlice";
import { SetData } from "./SetData/SetData";

interface LogFormProps {
    handleNavigateBack: () => void;
}

export const LogForm: React.FC<LogFormProps> = ({ handleNavigateBack }) => {
    const [weightInput, setWeightInput] = useState<string | null>(null);
    const [repsInput, setRepsInput] = useState<number | null>(null);
    const [isProgrammaticChange, setIsProgrammaticChange] = useState(false);
    const weightInputLength = weightInput !== null
        ? weightInput.length : 0;
    const calculatedWeightWidth = weightInputLength > 5 ? weightInputLength * 1 : 5;
    const repsInputLength = repsInput?.toString().length || 0;
    const calculatedRepsWidth = repsInputLength > 5 ? repsInputLength * 1 : 5;
    const dispatch = useDispatch();
    const [errorMessage, setErrorMessage] = useState<string | null>(null);
    const [editMode, setEditMode] = useState(false);
    const setList = useSelector(selectSetList);
    const selectedDate = useSelector(selectSelectedDate);
    const selectedExercise = useSelector(selectSelectedExercise);
    const workout = useSelector(selectWorkout);

    const handleDecrementWeight = () => {
        if (weightInputLength >= 7 && !weightInput?.includes('.')) {
            return;
        } else if (!weightInput || weightInput === '0') {
            setIsProgrammaticChange(true);
            setWeightInput('0.0'); // Explicitly set to 0.0
        } else {
            setIsProgrammaticChange(true);
            const newValue = Number(weightInput) - 5.0;
            setWeightInput((newValue.toFixed(1))); // Ensure consistent decimal place
        }
    };

    const handleIncrementWeight = () => {
        if (weightInputLength >= 7 && !weightInput?.includes('.')) {
            return;
        } else if (weightInputLength >= 10) {
            return;
        } else if (weightInput) {
            setIsProgrammaticChange(true);
            const newValue = Number(weightInput) + 5.0;
            setWeightInput(newValue.toFixed(1));
        } else {
            setIsProgrammaticChange(true);
            const newValue = 0 + 5.0;
            setWeightInput(newValue.toFixed(1));
        }
    }

    const handleIncrementReps = () => {
        if (repsInputLength >= 8) {
            return;
        } else if (repsInput) {
            setRepsInput(repsInput + 1)
        } else {
            setRepsInput(1)
        }
    }

    const handleDecrementReps = () => {
        if (repsInput === 0) {
            return;
        } else if (repsInput) {
            setRepsInput(repsInput - 1)
        } else {
            setRepsInput(0)
        }
    }

    const handleSaveSet = async () => {
        if (!weightInput && !repsInput) {
            setErrorMessage('Please enter a value for this set');
            return;
        }
        setErrorMessage(null);
        const savedReps = repsInput !== null ? repsInput : 0;
        const savedWeight = weightInput !== null ? weightInput : '0';
        const findIndexOfExercise = workout.findIndex(exercise => exercise.exercise_id === selectedExercise.id);
        const setNumber = (findIndexOfExercise === -1) ? 1 : workout[findIndexOfExercise].sets.length + 1;
        const weightInputToAdd = weightInput ? Number(weightInput) : 0;
        const repsInputToAdd = repsInput ? repsInput : 0;
        const exercise_order = (findIndexOfExercise === -1) ? workout.length + 1 : workout[findIndexOfExercise].exercise_order;
        const addSetResult = await addSetToLog(selectedDate, selectedExercise.id, setNumber, weightInputToAdd, repsInputToAdd, exercise_order);
        console.log(addSetResult);
        if (addSetResult) {
            dispatch(addExerciseToWorkout(addSetResult));
        }
        dispatch(addToSetList({
            weight: savedWeight,
            reps: savedReps,
            set_number: setList.length + 1
        }))
    }


    const handleClear = () => {
        setWeightInput(null);
        setRepsInput(null);
    }

    return (
        <div className="w-full flex justify-center items-center relative mt-4 flex-col overflow-y-auto">
            {errorMessage && <p className="absolute -top-8 bg-lightPurple px-2 rounded-md text-darkestPurple">{errorMessage}</p>}
            <button
                onClick={handleNavigateBack}
                className="absolute top-2 left-6"
            >
                <MdArrowBackIos className="text-3xl text-darkestPurple hover:text-darkPurple" />
            </button>
            <form className="flex flex-col w-2/3 space-y-6">
                <div className="px-2 space-y-2 flex flex-col">
                    <h4 className="border-b-2 border-darkPurple">Weight (kgs)</h4>
                    <div className="flex space-x-2 justify-center w-1/2 self-center">
                        <Button
                            onClick={handleDecrementWeight}
                            type="button"
                        >
                            <FaMinus />
                        </Button>
                        <input
                            value={
                                weightInput !== undefined && weightInput !== null
                                    ? isProgrammaticChange
                                        ? Number(weightInput).toFixed(1) // Show decimal when programmatically updated
                                        : weightInput // Show exact value for manual input
                                    : ""
                            }
                            type="number"
                            step="0.1"
                            className="border-b-2 border-darkPurple focus:outline-none appearance-none bg-transparent text-2xl text-center"
                            style={{ width: `${calculatedWeightWidth}rem` }}
                            placeholder=""
                            onChange={(e) => {
                                setIsProgrammaticChange(false); // Reset flag for manual input
                                const value = e.target.value;
                                if (value.length <= 8) {
                                    setWeightInput(value === "" ? null : value); // Allow manual input as-is
                                }
                            }}
                        />
                        <Button
                            onClick={handleIncrementWeight}
                            type="button"
                        >
                            <FaPlus />
                        </Button>
                    </div>

                </div>
                <div className="px-2 space-y-2">
                    <h4 className="border-b-2 border-darkPurple">Reps</h4>
                    <div className="w-full flex space-x-2 justify-center">
                        <Button
                            onClick={handleDecrementReps}
                            type="button"
                        >
                            <FaMinus />
                        </Button>
                        <input
                            value={repsInput !== null ? repsInput : ""}
                            type="number"
                            step="0.1"
                            className="border-b-2 border-darkPurple focus:outline-none appearance-none bg-transparent text-2xl text-center"
                            style={{ width: `${calculatedRepsWidth}rem` }}
                            placeholder=""
                            onChange={(e) => {
                                console.log(e.target.value);
                                const value = e.target.value;
                                if (value.length <= 8) {
                                    setRepsInput(value === "" ? null : Number(value)); // Clear or set number
                                }
                            }}
                        />
                        <Button
                            onClick={handleIncrementReps}
                            type="button"
                        >
                            <FaPlus />
                        </Button>
                    </div>
                    <div className="w-full flex justify-between space-x-2">
                        {editMode ? (
                            <>
                                <Button
                                    onClick={() => { }}
                                    type="button"
                                    className="flex-grow"
                                >
                                    Update
                                </Button>
                                <Button
                                    onClick={() => { }}
                                    type="button"
                                    className="flex-grow"
                                >
                                    Delete
                                </Button>
                            </>
                        ) : (
                            <>
                                <Button
                                    onClick={() => handleSaveSet()}
                                    type="button"
                                    className="flex-grow"
                                >
                                    Save
                                </Button>
                                <Button

                                    type="button"
                                    onClick={() => handleClear()}
                                    className="flex-grow"
                                >
                                    Clear
                                </Button>
                            </>
                        )}

                    </div>
                </div>
            </form>
            <SetData 
                setEditMode={setEditMode}
                setWeightInput={setWeightInput}
                setRepsInput={setRepsInput}
            />
        </div>

    )
}