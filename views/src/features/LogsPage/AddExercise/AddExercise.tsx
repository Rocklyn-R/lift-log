import { OverlayWindow } from "../../../components/OverlayWIndow";
import { ExerciseCategories } from "../../ExerciseLibrary/ExerciseCategories/ExerciseCategories";
import { Exercises } from "../../ExerciseLibrary/Exercises/Exercises";
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setExercises } from "../../../redux-store/LibrarySlice";
import { selectSelectedCategory, selectSelectedExercise, setExerciseHistory, setSelectedCategory, setSelectedExercise, setSelectedSet } from "../../../redux-store/LogsSlice";
import { ViewExercise } from "./ViewExercise/ViewExercise";
import { MdArrowBackIos } from "react-icons/md";

interface AddExerciseProps {
    setShowAddExercise: (arg1: boolean) => void;
}

export const AddExercise: React.FC<AddExerciseProps> = ({ setShowAddExercise }) => {
    const [showCategories, setShowCategories] = useState(true);
    const [showExercises, setShowExercises] = useState(false);
    const [showLogForm, setShowLogForm] = useState(false);
    const dispatch = useDispatch();
    const selectedCategory = useSelector(selectSelectedCategory);
    const selectedExercise = useSelector(selectSelectedExercise);


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

    const handleCloseOverlay = () => {
        setShowAddExercise(false);
        setShowExercises(false);
        setShowCategories(true);
        setShowLogForm(false);
        dispatch(setExercises([]));
        dispatch(setSelectedCategory(""));
        dispatch(setSelectedExercise(null));
        dispatch(setSelectedSet(null));
        dispatch(setExerciseHistory([]));
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
            className="w-1/3 relative"
            className2="max-h-[65vh] min-h-[65vh] overflow-y-auto "
        >
            {(showExercises || showLogForm )&& (
                <button
                    onClick={handleNavigateBack}
                    className="absolute top-4 left-4 hover:cursor-pointer z-50"
                >
                    <MdArrowBackIos className="text-xl text-lightestPurple" />
                </button>
            )}

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
            {showLogForm && (
                <>
                    <ViewExercise
                    />
                </>
            )}

        </OverlayWindow>
    )
}