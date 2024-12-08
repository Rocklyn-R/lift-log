import { OverlayWindow } from "../../../components/OverlayWIndow";
import { ExerciseCategories } from "../../ExerciseLibrary/ExerciseCategories/ExerciseCategories";
import { Exercises } from "../../ExerciseLibrary/Exercises/Exercises";
import { LogForm } from "./LogForm/LogForm";
import { SetData } from "./LogForm/SetData/SetData";
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setExercises } from "../../../redux-store/LibrarySlice";
import { selectSelectedCategory, selectSelectedExercise, setSelectedCategory, setSelectedExercise, setSelectedSet, setSetList } from "../../../redux-store/LogsSlice";

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
        dispatch(setSelectedExercise({}));
        dispatch(setSetList([]));
        dispatch(setSelectedSet({}));
    }
    return (
        <OverlayWindow
            onClose={handleCloseOverlay}
            headerText={`Add Exercise ${showExercises
                ? `- ${selectedCategory}`
                : showLogForm
                    ? `- ${selectedExercise?.name}`
                    : ""
                }`}
            className="w-1/3"
        >
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
                    <LogForm
                        handleNavigateBack={handleShowExercises}
                    />
                </>
            )}

        </OverlayWindow>
    )
}