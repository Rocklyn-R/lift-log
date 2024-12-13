import { useSelector } from "react-redux"
import { selectExercises, setExercises } from "../../../redux-store/LibrarySlice"
import { MdArrowBackIos } from "react-icons/md";
import { useNavigate, useParams } from "react-router-dom";
import { useEffect } from "react";
import { OverlayWindow } from "../../../components/OverlayWIndow";
import { Exercise } from "../../../types/types";
import { getExercises } from "../../../api/exercises";
import { useDispatch } from "react-redux";
import { selectSelectedExercise, setSelectedExercise } from "../../../redux-store/LogsSlice";
import { ViewExercise } from "../../LogsPage/AddExercise/ViewExercise/ViewExercise";

interface ExercisesProps {
    source: "logs" | "library",
    handleShowCategories?: () => void;
    handleSelectExercise?: () => void;
}

export const Exercises: React.FC<ExercisesProps> = ({ source, handleShowCategories, handleSelectExercise }) => {
    const exercises = useSelector(selectExercises);
    const navigate = useNavigate();
    const selectedExercise = useSelector(selectSelectedExercise);
    //const [selectedExercise, setSelectedExercise] = useState<Exercise | null>(null);
    const { categoryId } = useParams<{ categoryId: string }>();
    const dispatch = useDispatch();

    const handleNavigateBack = () => {
        if (source === "library") {
           navigate('/exercise-library') 
        } else if (source === 'logs' && handleShowCategories){
            handleShowCategories();
        }
    }

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
        <div className="flex flex-col relative">
            {/* Header */}

            <button
                onClick={() => handleNavigateBack()}
                style={{ height: '0' }}
                className="top-6 sticky ml-6"
            ><MdArrowBackIos className="text-3xl text-darkestPurple hover:text-darkPurple" /></button>
            {/* Main Content with Flex for center alignment */}
            <div className="flex-grow flex justify-center my-4">

                <div className="flex flex-col items-center w-1/2 space-y-2">
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
                  <ViewExercise 
                     action="add"
                     source="library"
                  />
                </OverlayWindow>

            )}
        </div>
    );
};