import { useSelector } from "react-redux"
import { selectSelectedDate, setSelectedDate } from "../../redux-store/LogsSlice";
import { MdArrowBackIos } from "react-icons/md";
import { MdArrowForwardIos } from "react-icons/md";
import { adjustDate, formatDate } from "../../utilities/utilities";
import { useDispatch } from "react-redux";
import { FaPlus } from "react-icons/fa6";
import { useState } from "react";
import { OverlayWindow } from "../../components/OverlayWIndow";
import { LogForm } from "./LogForm/LogForm";
import { ExerciseCategories } from "../ExerciseLibrary/ExerciseCategories/ExerciseCategories";
import { getExercises } from "../../api/exercises";
import { setExercises } from "../../redux-store/LibrarySlice";
import { Exercises } from "../ExerciseLibrary/Exercises/Exercises";


export const LogsPage = () => {
    const selectedDate = useSelector(selectSelectedDate);
    const dispatch = useDispatch();

    const handleAdjustDate = (direction: 'back' | 'forward') => {
        const newDate = adjustDate(direction, selectedDate);
        dispatch(setSelectedDate(newDate));
    }

    const [showAddExercise, setShowAddExercise] = useState(false);
    const [showCategories, setShowCategories] = useState(true);
    const [showExercises, setShowExercises] = useState(false);
    const [showLogForm, setShowLogForm] = useState(false);

  /*  const handleAddToLog = () => {
        setShowAddExercise(true);
        setShowCategories(true);
    }*/

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
    }

    return (
        <div className="w-full flex justify-center">
            <div className="w-full flex flex-col items-center justify-between h-screen">
                <div className="w-full py-5 px-52 bg-darkestPurple flex justify-between items-center">
                    <button
                        onClick={() => handleAdjustDate('back')}
                        className="text-lightestPurple text-2xl"
                    >
                        <MdArrowBackIos />
                    </button>

                    <h1 className="text-lightestPurple text-xl font-semibold flex-grow text-center">
                        {formatDate(selectedDate)}
                    </h1>

                    <button
                        onClick={() => handleAdjustDate('forward')}
                        className="text-lightestPurple text-2xl"
                    >
                        <MdArrowForwardIos />
                    </button>
                </div>
                <div className="mb-10">
                    <button
                        onClick={() => setShowAddExercise(true)}
                        className="bg-darkestPurple p-3 rounded-full text-lightestPurple text-2xl hover:bg-darkPurple">
                        <FaPlus />
                    </button>
                </div>

            </div>
            {showAddExercise && (
                <OverlayWindow
                    onClose={handleCloseOverlay}
                    headerText="Add Exercise"
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
                        <LogForm 
                            handleNavigateBack={handleShowExercises}
                        />
                    )}
                    
                </OverlayWindow>
            )}
        </div>
    )
}