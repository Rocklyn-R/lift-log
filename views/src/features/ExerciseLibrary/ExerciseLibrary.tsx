import { Header } from "../../components/Header";
import { ExerciseCategories } from "./ExerciseCategories/ExerciseCategories"
import { useNavigate, useParams } from "react-router-dom";
import { Exercises } from "./Exercises/Exercises";
import { MdArrowBackIos } from "react-icons/md";
import { FaPlus } from "react-icons/fa6";
import { useState } from "react";
import { AddExercise } from "./AddExercise/AddExercise";


export const ExerciseLibrary = () => {
    const { categoryId } = useParams<{ categoryId?: string }>();
    const navigate = useNavigate();
    const handleNavigateBack = () => {
        if (categoryId) {
            navigate('/exercise-library')
        }
    }
    const [showAddExercise, setShowAddExercise] = useState(false);


    return (
        <div className="flex flex-col relative h-screen w-full justify-center">
            {categoryId && (
                <button
                    onClick={() => handleNavigateBack()}
                    style={{ height: '0' }}
                    className="absolute top-6 left-12 z-50"
                ><MdArrowBackIos className="text-2xl text-lightestPurple" /></button>
            )}
            {/* Sticky Header */}
            <Header text="Exercise Library" />
            <button
                onClick={() => setShowAddExercise(true)}
                className="bg-darkestPurple p-3 fixed bottom-14 right-14 rounded-full justify-self-end text-lightestPurple text-2xl hover:bg-darkPurple">
                <FaPlus />
            </button>
            {/* Scrollable content area */}
            <div className="flex-grow overflow-y-auto p-4">
                {/* Conditionally render ExerciseCategories or Exercises based on categoryId */}
                {categoryId ? (
                    <Exercises
                        source="library"
                    />
                ) : (
                    <ExerciseCategories
                        source="library"
                    />
                )}
            </div>
            {showAddExercise && (
                <AddExercise 
                    setShowAddExercise={setShowAddExercise}
                />
            )}
        </div>
    );
}