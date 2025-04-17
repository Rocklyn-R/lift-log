import { useEffect, useState } from "react";
import { FaPlus, FaMinus } from "react-icons/fa6";
import { useSelector } from "react-redux";
import { useDispatch } from "react-redux";
import { addSetToLog, deleteSet, editLog, getUpdatedPrs, updatePR, updateSetNumber } from "../../../../../api/logs";
import { Button } from "../../../../../components/Button";
import { Loading } from "../../../../../components/Loading";
import {
    addExerciseToWorkout,
    deleteSetUpdateSetNumbers,
    editSet,
    selectHistory,
    selectSelectedDate,
    selectSelectedExercise,
    selectSelectedSet,
    selectWorkout,
    setSelectedSet,
    updateHistoryOnDelete,
    updateHistoryOnEdit,
    updateHistoryOnInsert,
    updatePr
} from "../../../../../redux-store/LogsSlice";
import { selectUnitSystem } from "../../../../../redux-store/SettingsSlice";
import { findPRsOnDelete, findPRsOnInsert, findPRsOnUpdate, formatNumber } from "../../../../../utilities/utilities";
import { SetData } from "./SetData/SetData";
import { v4 as uuidv4 } from 'uuid';


export const LogForm = () => {
    const selectedExercise = useSelector(selectSelectedExercise);
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
    const selectedDate = useSelector(selectSelectedDate);
    const workout = useSelector(selectWorkout);
    const selectedSet = useSelector(selectSelectedSet);
    const unit_system = useSelector(selectUnitSystem);
    const metric = unit_system === "Metric";
    const history = useSelector(selectHistory)
    const [loadingSave, setLoadingSave] = useState(false);



    useEffect(() => {
        if (errorMessage) {
            setTimeout(() => {
                setErrorMessage(null)
            }, 1500)
        }
    }, [errorMessage])

    useEffect(() => {
        if (selectedExercise) {
            const foundIndex = workout.findIndex(exercise => exercise.exercise_id === selectedExercise.exercise_id);
            if (foundIndex !== -1 && (workout[foundIndex].sets.length > 0)) {
                const setIndex = workout[foundIndex].sets.length - 1;
                const weightToSet = unit_system === "Metric" ? workout[foundIndex].sets[setIndex].weight : workout[foundIndex].sets[setIndex].weight_lbs;
                setWeightInput(formatNumber(weightToSet));
            }
        }
    }, [selectedExercise, setWeightInput, workout, unit_system])

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
        if (selectedExercise) {
            setLoadingSave(true);
            const findIndexOfExercise = workout.findIndex(exercise => exercise.exercise_id === selectedExercise.exercise_id);
            const setId = uuidv4();
            const setNumber = (findIndexOfExercise === -1) ? 1 : workout[findIndexOfExercise].sets.length + 1;
            const weightInputMetric = weightInput
                ? metric
                    ? Number(weightInput)
                    : Number((Number(weightInput) / 2.2).toFixed(2))
                : 0;
            const weightInputImperial = weightInput
                ? metric
                    ? Number((Number(weightInput) * 2.2).toFixed(2))
                    : Number(weightInput)
                : 0;
            const repsInputToAdd = repsInput ? repsInput : 0;
            const exercise_order = (findIndexOfExercise === -1) ? workout.length + 1 : workout[findIndexOfExercise].exercise_order;
            const newSet = {
                weight: weightInputMetric,
                reps: repsInputToAdd,
                date: selectedDate,
                set_number: setNumber
            };
            const PRData = (findPRsOnInsert(history, newSet));
            const exerciseObject = {
                PR: PRData.newPR,
                date: selectedDate,
                distance: null,
                exercise_id: selectedExercise.exercise_id,
                exercise_name: selectedExercise.exercise_name,
                exercise_order: exercise_order,
                id: setId,
                reps: repsInputToAdd,
                set_number: setNumber,
                time: null,
                weight: weightInputMetric,
                weight_lbs: weightInputImperial,
            }
            dispatch(addExerciseToWorkout({
                ...exerciseObject, PRsToRemove: PRData.removePRsSetIds
            }))

            dispatch(updateHistoryOnInsert({
                ...exerciseObject, removePRsSetIds: PRData.removePRsSetIds
            }))
            const addSetResult = await addSetToLog(setId, selectedDate, selectedExercise.exercise_id, setNumber, weightInputMetric, weightInputImperial, repsInputToAdd, exercise_order, PRData.newPR);
            setLoadingSave(false);
            if (PRData.removePRsSetIds.length > 0) {
                PRData.removePRsSetIds.forEach(async (set_id) => await updatePR(false, set_id))
            }

        }

    }

    const handleClear = () => {
        setWeightInput(null);
        setRepsInput(null);
    }

    const updateSet = async () => {
        if (selectedExercise) {
            const repsInputToAdd = repsInput ? repsInput : 0;
            if (selectedSet) {
                let updateResult;
                const weightInputMetric = weightInput
                    ? metric
                        ? Number(weightInput)
                        : Number((Number(weightInput) / 2.2).toFixed(2))
                    : 0;
                const weightInputImperial = weightInput
                    ? metric
                        ? Number((Number(weightInput) * 2.2).toFixed(2))
                        : Number(weightInput)
                    : 0;
                updateResult = await editLog(weightInputMetric, repsInputToAdd, selectedSet?.set_id, weightInputImperial);
                
       
               
                const setObjectToUpdate = {
                    weight: weightInputMetric,
                    reps: repsInputToAdd,
                    set_id: selectedSet.set_id,
                    pr: selectedSet.pr
                }
                
               /* const exerciseObject = {
                    PR: PRData.newPR,
                    date: selectedDate,
                    distance: null,
                    exercise_id: selectedExercise.exercise_id,
                    exercise_name: selectedExercise.exercise_name,
                    exercise_order: exercise_order,
                    id: setId,
                    reps: repsInputToAdd,
                    set_number: setNumber,
                    time: null,
                    weight: weightInputMetric,
                    weight_lbs: weightInputImperial,
                }*/
                const PRData = findPRsOnUpdate(history, setObjectToUpdate);
            
                const PR = PRData.setPRTrue.includes(selectedSet.set_id);
                const exerciseObject = {
                    PR: PR,
                    date: selectedDate,
                    distance: null,
                    exercise_id: selectedExercise.exercise_id,
                    exercise_name: selectedExercise.exercise_name,
                    id: selectedSet.set_id,
                    reps: repsInputToAdd,
                    set_number: selectedSet.set_number,
                    time: null,
                    weight: weightInputMetric,
                    weight_lbs: weightInputImperial,
                    PRData: PRData
                }
                dispatch(editSet(exerciseObject));
                dispatch(updateHistoryOnEdit(exerciseObject))
            
                if (PRData.setPRTrue.length > 0) {
                    PRData.setPRTrue.forEach(async (set_id) => await updatePR(true, set_id))
                }
                if (PRData.setPRFalse.length > 0) {
                    PRData.setPRFalse.forEach(async (set_id) => await updatePR(false, set_id))
                }
          
                dispatch(setSelectedSet(null));
            }
            setEditMode(false);
        }
    }

    const handleDeleteSet = async () => {
        if (selectedSet && selectedExercise) {
            const foundIndex = workout.findIndex(exercise => exercise.exercise_id === selectedSet.exercise_id);
            if (foundIndex !== -1) {
                const sets = workout[foundIndex].sets
                const filteredSets = sets.filter(set => set.set_number > selectedSet.set_number)
                const setIds = filteredSets.map(set => set.set_id);

                setIds.forEach(async (set_id) => {
                    await updateSetNumber(set_id);

                })
            }

            const PRData = findPRsOnDelete(history, selectedSet.set_id);
            dispatch(deleteSetUpdateSetNumbers({ ...selectedSet, PRData: PRData }));
            dispatch(setSelectedSet(null));
            dispatch(updateHistoryOnDelete({ set_id: selectedSet.set_id, PRData, date: selectedDate, set_number: selectedSet.set_number }))

            const setDeletion = await deleteSet(selectedSet.set_id);
            if (PRData.length > 0) {
                PRData.forEach(async (set_id) => await updatePR(true, set_id));
            }


        }
        setEditMode(false);
    }

    return (
        <div className="min-h-[55vh] max-h-[62vh] rounded-b-xl w-full flex justify-start items-center relative pt-4 flex-col z-40 dark:bg-darkestPurple bg-lightestPurple">
            {errorMessage && <p className="absolute top-0 z-50 bg-lightPurple px-2  text-darkestPurple text-sm">{errorMessage}</p>}


            <form className="flex flex-col w-2/3 space-y-6 dark:text-lightPurple font-semibold">
                <div className="px-2 space-y-2 flex flex-col">
                    <h4 className="border-b-2 dark:border-lightPurple border-darkPurple">Weight {unit_system === "Metric" ? '(kgs)' : '(lbs)'}</h4>
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
                            className="weight-reps-input border-b-2 dark:border-lightPurple border-darkPurple focus:outline-none appearance-none bg-transparent text-2xl text-center"
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
                    <h4 className="border-b-2 dark:border-lightPurple border-darkPurple">Reps</h4>
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
                            className="weight-reps-input border-b-2 dark:border-lightPurple border-darkPurple focus:outline-none appearance-none bg-transparent text-2xl text-center"
                            style={{ width: `${calculatedRepsWidth}rem` }}
                            placeholder=""
                            onChange={(e) => {
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
                                    onClick={updateSet}
                                    type="button"
                                    className="flex-grow w-full"
                                >
                                    Update
                                </Button>
                                <Button
                                    onClick={handleDeleteSet}
                                    type="button"
                                    className="flex-grow w-full"
                                >
                                    Delete
                                </Button>
                            </>
                        ) : (
                            <>
                                <Button
                                    onClick={() => handleSaveSet()}
                                    type="button"
                                    className="flex-grow flex items-center justify-center w-full"
                                >
                                    Save
                                </Button>
                                <Button

                                    type="button"
                                    onClick={() => handleClear()}
                                    className="flex-grow w-full"
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