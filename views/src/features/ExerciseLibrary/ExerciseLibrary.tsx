import { Header } from "../../components/Header";
import { ExerciseCategories } from "./ExerciseCategories/ExerciseCategories"
import { useNavigate, useParams } from "react-router-dom";
import { Exercises } from "./Exercises/Exercises";
import { MdArrowBackIos } from "react-icons/md";
import { FaPlus } from "react-icons/fa6";
import { useState } from "react";
import { AddExercise } from "./AddExercise/AddExercise";
import { Loading } from "../../components/Loading";
import { useSelector } from "react-redux";
import { selectLibraryLoading } from "../../redux-store/LibrarySlice";


export const ExerciseLibrary = () => {
    const { categoryId } = useParams<{ categoryId?: string }>();
    const navigate = useNavigate();
    const isLoading = useSelector(selectLibraryLoading);
    const handleNavigateBack = () => {
        if (categoryId) {
            navigate('/exercise-library')
        }
    }
    const [showAddExercise, setShowAddExercise] = useState(false);
    



    return (
        <div className="flex flex-col xl:pl-0 pl-16  phones-sm:pb-24 relative h-screen w-full justify-center">
            {categoryId && (
                <button
                    onClick={() => handleNavigateBack()}
                    style={{ height: '0' }}
                    className="absolute top-6 left-24 xl:left-12 z-45"
                ><MdArrowBackIos className="text-2xl text-lightestPurple" /></button>
            )}

            <Header text="Exercise Library" />
            <button
                onClick={() => setShowAddExercise(true)}
                className="z-50 phones-sm:hidden border-2 border-transparent dark:border-mediumPurple dark:bg-darkPurple dark:hover:bg-lightestPurple dark:hover:text-darkestPurple bg-darkestPurple p-3 fixed bottom-12 right-6 sm:right-10 rounded-full justify-self-end text-lightestPurple text-2xl hover:bg-darkPurple">
                <FaPlus />
            </button>
            {isLoading ? (
                <div className="dark:bg-darkestPurple flex flex-col items-center justify-center h-screen bg-lightestPurple">
                    <Loading />
                </div>
            ) : (
                <div className={` flex-grow overflow-y-auto p-2`}>

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
            )}
      <div className="z-40 phones-sm:fixed phones-sm:flex hidden justify-center items-center bottom-0 left-0 w-full h-[10%] pl-16 space-x-4 dark:bg-darkestPurple bg-lightestPurple border-t-2 border-mediumPurple">
                    <button
                        onClick={() => setShowAddExercise(true)}
                        className="z-40 dark:border-mediumPurple dark:bg-darkPurple dark:hover:bg-lightestPurple dark:hover:text-darkestPurple border-2 border-transparent bg-darkestPurple p-3 rounded-full text-lightestPurple text-2xl hover:bg-darkPurple">
                        <FaPlus />
                    </button>
  

                </div>
            {showAddExercise && (
                <AddExercise
                    setShowAddExercise={setShowAddExercise}
                />
            )}
        </div>
    );
}