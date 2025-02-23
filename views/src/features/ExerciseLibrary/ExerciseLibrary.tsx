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
        <div className="flex flex-col xl:pl-0 pl-16 relative h-screen w-full justify-center">
            {categoryId && (
                <button
                    onClick={() => handleNavigateBack()}
                    style={{ height: '0' }}
                    className="absolute top-6 left-24 xl:left-12 z-50"
                ><MdArrowBackIos className="text-2xl text-lightestPurple" /></button>
            )}
           
            <Header text="Exercise Library" />
            <button
                onClick={() => setShowAddExercise(true)}
                className="z-50 border-2 border-transparent dark:border-lightestPurple dark:bg-darkPurple dark:hover:bg-lightestPurple dark:hover:text-darkestPurple bg-darkestPurple p-3 fixed bottom-12 right-6 sm:right-10 rounded-full justify-self-end text-lightestPurple text-2xl hover:bg-darkPurple">
                <FaPlus />
            </button>
           
            <div className={` flex-grow overflow-y-auto p-4`}>
                
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