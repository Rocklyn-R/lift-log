import { useSelector } from "react-redux"
import { Header } from "../../../components/Header";
import { selectExercises, setExercises } from "../../../redux-store/LibrarySlice"
import { MdArrowBackIos } from "react-icons/md";
import { useNavigate, useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { ViewExercise } from "../ViewExercise/ViewExercise";
import { OverlayWindow } from "../../../components/OverlayWIndow";
import { Exercise } from "../../../types/types";
import { getExercises } from "../../../api/exercises";
import { useDispatch } from "react-redux";



export const Exercises = () => {
    const exercises = useSelector(selectExercises);
    const navigate = useNavigate();
    const [selectedExercise, setSelectedExercise] = useState<Exercise | null>(null);
    const { categoryId } = useParams<{ categoryId: string }>();
    const dispatch = useDispatch();

    const handleNavigateBack = () => {
        navigate('/exercise-library')
    }

    const handleOpenExercise = (exercise: Exercise) => {
        setSelectedExercise(exercise)
    }

    const handleCloseExervise = () => {
        setSelectedExercise(null)
    }

    useEffect(() => {
        const fetchExercises = async () => {
            if (categoryId) {
                const exerciseResults = await getExercises(parseInt(categoryId));
                dispatch(setExercises(exerciseResults))
            }
        }
        fetchExercises();
    }, [categoryId])

    return (
        <div className="flex flex-col h-screen relative">
            {/* Header */}

            <button
                onClick={() => handleNavigateBack()}
                style={{ height: '0' }}
                className="top-4 sticky ml-6"
            ><MdArrowBackIos className="text-3xl text-darkestPurple hover:text-darkPurple" /></button>
            {/* Main Content with Flex for center alignment */}
            <div className="flex-grow p-4 overflow-y-auto flex justify-center">

                <div className="flex flex-col items-center w-1/2 space-y-2">
                    {exercises.map((exercise, index) => (
                        <button
                            onClick={() => handleOpenExercise(exercise)}
                            key={index}
                            className="border-2 border-darkestPurple rounded-md hover:text-xl hover:font-semibold shadow-lg hover:bg-lightPurple text-lg p-2 w-full"
                        >
                            {exercise.name}
                        </button>
                    ))}
                </div>
            </div>
            {selectedExercise && (
                <OverlayWindow
                    headerText={selectedExercise.name}
                    onClose={handleCloseExervise}
                    className="w-1/3"
                    >
                    <ViewExercise
                        exercise={selectedExercise}
                    />
                </OverlayWindow>

            )}
        </div>
    );
};