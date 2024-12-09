import { useSelector } from "react-redux"
import { selectSelectedCategory, selectSelectedDate, selectSelectedExercise, selectWorkout, setSelectedDate } from "../../redux-store/LogsSlice";
import { MdArrowBackIos } from "react-icons/md";
import { MdArrowForwardIos } from "react-icons/md";
import { adjustDate, formatDate } from "../../utilities/utilities";
import { useDispatch } from "react-redux";
import { FaPlus } from "react-icons/fa6";
import { useState } from "react";
import { OverlayWindow } from "../../components/OverlayWIndow";
import { LogForm } from "./AddExercise/LogForm/LogForm";
import { ExerciseCategories } from "../ExerciseLibrary/ExerciseCategories/ExerciseCategories";
import { getExercises } from "../../api/exercises";
import { setExercises } from "../../redux-store/LibrarySlice";
import { Exercises } from "../ExerciseLibrary/Exercises/Exercises";
import { SetData } from "./AddExercise/LogForm/SetData/SetData";
import { AddExercise } from "./AddExercise/AddExercise";
import { Log } from "./Log/Log";
import { EditExercise } from "./EditExercise/EditExercise";


export const LogsPage = () => {
    const selectedDate = useSelector(selectSelectedDate);
    const dispatch = useDispatch();
    const selectedCategory = useSelector(selectSelectedCategory);
    const selectedExercise = useSelector(selectSelectedExercise);
    const workout = useSelector(selectWorkout);

    const handleAdjustDate = (direction: 'back' | 'forward') => {
        const newDate = adjustDate(direction, selectedDate);
        dispatch(setSelectedDate(newDate));
    }

    const [showAddExercise, setShowAddExercise] = useState(false);
    const [showEditExercise, setShowEditExercise] = useState(false);


    return (
        <div className="w-full flex justify-center overflow-y-auto">
            <div className="w-full relative flex flex-col items-center  h-screen">
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

                <div className="flex flex-col w-1/3 space-y-4 mt-4">
               
                 <Log 
                    setShowEditExercise={setShowEditExercise}
                 />
                 

                </div>
                <div className="mb-10 bottom-2 sticky">
                    <button
                        onClick={() => setShowAddExercise(true)}
                        className="bg-darkestPurple p-3 rounded-full justify-self-end text-lightestPurple text-2xl hover:bg-darkPurple">
                        <FaPlus />
                    </button>
                </div>

            </div>
            {showAddExercise && (
                <AddExercise
                    setShowAddExercise={setShowAddExercise}
                />
            )}

            {showEditExercise && (
                <EditExercise 
                    setShowEditExercise={setShowEditExercise}
                />
            )}
        </div>
    )
}