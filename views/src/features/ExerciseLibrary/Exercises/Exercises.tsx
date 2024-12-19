import { useSelector } from "react-redux"
import { selectExercises, setExercises } from "../../../redux-store/LibrarySlice"
import { useParams } from "react-router-dom";
import { useEffect } from "react";
import { OverlayWindow } from "../../../components/OverlayWIndow";
import { Exercise } from "../../../types/types";
import { getExercises } from "../../../api/exercises";
import { useDispatch } from "react-redux";
import { selectSelectedExercise, setSelectedExercise } from "../../../redux-store/LogsSlice";
import { ViewLog } from "../../LogsPage/AddLog/ViewLog/ViewLog";

interface ExercisesProps {
    source: "logs" | "library",
    handleShowCategories?: () => void;
    handleSelectExercise?: () => void;
}

export const Exercises: React.FC<ExercisesProps> = ({ source, handleShowCategories, handleSelectExercise }) => {
    const exercises = useSelector(selectExercises);
    const selectedExercise = useSelector(selectSelectedExercise);
    const { categoryId } = useParams<{ categoryId: string }>();
    const dispatch = useDispatch();


    const handleOpenExercise = (exercise: Exercise) => {
        if (source === "library") {
           dispatch(setSelectedExercise(exercise)) 
        } else if (source === "logs" && handleSelectExercise) {
            handleSelectExercise();
            dispatch(setSelectedExercise(exercise));
        }
    }

    const handleCloseExervise = () => {
        dispatch(setSelectedExercise(null))
    }

    useEffect(() => {
        const fetchExercises = async () => {
            if (categoryId) {
                const exerciseResults = await getExercises(parseInt(categoryId));
                dispatch(setExercises(exerciseResults))
            }
        }
        fetchExercises();
    }, [categoryId, dispatch])

    return (
        <div className="flex flex-col">
            {/* Header */}

            {/* Main Content with Flex for center alignment */}
            <div className="flex-grow flex justify-center my-4">

                <div className="flex flex-col items-center md:w-1/2 sm:w-2/3 w-full space-y-2">
                    {exercises.map((exercise, index) => (
                        <button
                            onClick={() => handleOpenExercise(exercise)}
                            key={index}
                            className="bg-gray-100 border-2 border-darkestPurple rounded-md hover:text-xl hover:font-semibold shadow-lg hover:bg-lightPurple text-lg p-2 w-full"
                        >
                            {exercise.exercise_name}
                        </button>
                    ))}
                </div>
            </div>
            {selectedExercise && (source=== "library") && (
                <OverlayWindow
                    headerText={selectedExercise.exercise_name}
                    onClose={handleCloseExervise}
                    className="w-1/3"
                >
                  <ViewLog 
                  />
                </OverlayWindow>

            )}
        </div>
    );
};