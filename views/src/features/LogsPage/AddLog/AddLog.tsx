import { OverlayWindow } from "../../../components/OverlayWIndow";
import { ExerciseCategories } from "../../ExerciseLibrary/ExerciseCategories/ExerciseCategories";
import { Exercises } from "../../ExerciseLibrary/Exercises/Exercises";
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setExercises } from "../../../redux-store/LibrarySlice";
import { selectSelectedCategory, selectSelectedExercise, setExerciseHistory, setSelectedCategory, setSelectedExercise, setSelectedSet } from "../../../redux-store/LogsSlice";
import { ViewLog } from "./ViewLog/ViewLog";
import { MdArrowBackIos } from "react-icons/md";

interface AddLogProps {
    setShowAddExercise: (arg1: boolean) => void;
}

export const AddLog: React.FC<AddLogProps> = ({ setShowAddExercise }) => {
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
            className="phones:w-full xs:w-4/5 sm:w-3/5 md:w-1/2 lg:w-1/3 relative"
            className2={`${showExercises ? 'max-h-[70vh]' : "max-h-[75vh]"}  min-h-[65vh]`}
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