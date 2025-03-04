import { OverlayWindow } from "../../../components/OverlayWIndow";
import { ExerciseCategories } from "../../ExerciseLibrary/ExerciseCategories/ExerciseCategories";
import { Exercises } from "../../ExerciseLibrary/Exercises/Exercises";
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setExercises } from "../../../redux-store/LibrarySlice";
import { selectSelectedCategory, selectSelectedDate, selectSelectedExercise, selectWorkout, setExerciseHistory, setSelectedCategory, setSelectedExercise, setSelectedSet, updateExerciseOrder } from "../../../redux-store/LogsSlice";
import { ViewLog } from "./ViewLog/ViewLog";
import { MdArrowBackIos } from "react-icons/md";
import { useEffect } from "react";
import { reorderExercises } from "../../../api/logs";

interface AddLogProps {
    closeAddExercise: () => void;
}

export const AddLog: React.FC<AddLogProps> = ({ closeAddExercise }) => {
    const [showCategories, setShowCategories] = useState(true);
    const [showExercises, setShowExercises] = useState(false);
    const [showLogForm, setShowLogForm] = useState(false);
    const dispatch = useDispatch();
    const selectedCategory = useSelector(selectSelectedCategory);
    const selectedExercise = useSelector(selectSelectedExercise);
    const workout = useSelector(selectWorkout);
    const selectedDate = useSelector(selectSelectedDate);


    const handleShowExercises = () => {
        setShowExercises(true);
        setShowCategories(false);
        setShowLogForm(false);
    }

    const handleShowCategories = () => {
        setShowExercises(false);
        setShowCategories(true);
    }

    const handleSelectExercise = () => {
        setShowExercises(false);
        setShowCategories(false);
        setShowLogForm(true);
    }

    const changeExerciseOrder = () => {
        const exerciseInWorkout = workout.find(exercise => exercise.exercise_id === selectedExercise?.exercise_id);
        console.log(exerciseInWorkout);
        if (!exerciseInWorkout) {
            workout.forEach(async (exercise, index) => {
                const newOrder = index + 1;
                const orderChange = await reorderExercises(newOrder, selectedDate, exercise.exercise_id);
                if (orderChange) {
                    const newExercise = {
                        exercise_id: exercise.exercise_id,
                        exercise_order: newOrder
                    }
                    dispatch(updateExerciseOrder(newExercise))
                }
            })
        }
     
    }

    const handleCloseOverlay = () => {
        closeAddExercise();
        
    }

    const handleNavigateBack = () => {
        if (showExercises) {
            handleShowCategories();
        } else {
            handleShowExercises()
        }
    }
    return (
        <OverlayWindow
            onClose={handleCloseOverlay}
            headerText={`${showExercises
                ? `All Exercises - ${selectedCategory}`
                : showLogForm
                    ? `${selectedExercise?.exercise_name}`
                    : "All Exercises"
                }`}
            className="dark:bg-darkestPurple phones:w-full xs:w-4/5 sm:w-3/5 md:w-1/2 lg:w-1/3 relative"
            className2={`${showExercises ? 'max-h-[65vh]' : "max-h-[75vh]"}  min-h-[65vh]`}
        >
            {(showExercises || showLogForm) && (
                <button
                    onClick={handleNavigateBack}
                    className="absolute top-4 left-2 sm:left-4 hover:cursor-pointer z-50"
                >
                    <MdArrowBackIos className="sm:text-xl text-lightestPurple" />
                </button>
            )}
            <div className="px-6 overflow-y-auto">
                {showCategories && (
                    <ExerciseCategories
                        handleShowExercises={handleShowExercises}
                        source="logs"
                    />
                )}
                {showExercises && (
                    <Exercises
                        source="logs"
                        handleShowCategories={handleShowCategories}
                        handleSelectExercise={handleSelectExercise}
                    />
                )}
            </div>

            {showLogForm && (
                <>
                
                    <ViewLog
                    />
                </>
            )}

        </OverlayWindow>
    )
}