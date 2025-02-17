import { useSelector } from "react-redux"
import { selectCategories, selectExercises, setExercises } from "../../../redux-store/LibrarySlice"
import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { OverlayWindow } from "../../../components/OverlayWIndow";
import { Exercise } from "../../../types/types";
import { getExercises } from "../../../api/exercises";
import { useDispatch } from "react-redux";
import { selectSelectedCategory, selectSelectedExercise, setSelectedExercise } from "../../../redux-store/LogsSlice";
import { ViewLog } from "../../LogsPage/AddLog/ViewLog/ViewLog";
import { Loading } from "../../../components/Loading";

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
    const [loading, setLoading] = useState(true);
    const selectedCategory = useSelector(selectSelectedCategory);
    const categories = useSelector(selectCategories);


    const handleOpenExercise = (exercise: Exercise) => {
        if (source === "library") {
            dispatch(setSelectedExercise(exercise))
        } else if (source === "logs" && handleSelectExercise) {
            handleSelectExercise();
            dispatch(setSelectedExercise(exercise));
        }
    }

    const handleCloseExercise = () => {
        dispatch(setSelectedExercise(null))
    }

    useEffect(() => {
        const fetchExercises = async () => {
            if (categoryId && source === "library") {
                const exerciseResults = await getExercises(parseInt(categoryId));
                dispatch(setExercises(exerciseResults))
                setLoading(false);
            }
        }
        if (source === "library") {
            fetchExercises();
        }
    }, [categoryId, dispatch])

    useEffect(() => {
        const fetchExercises = async () => {
            const categoryId = categories.find(category => category.name === selectedCategory)?.id;
            if (categoryId && source === "logs") {
                const exercisesFetch = await getExercises(categoryId);
                dispatch(setExercises(exercisesFetch));
                setLoading(false);
            }
        }
        if (source === "logs") {
            fetchExercises();
        }

    }, [dispatch, setLoading])



    return (
        <div className="flex flex-col">
            {/* Main Content with Flex for center alignment */}
            <div className="flex-grow flex justify-center my-4">

                <div className={`${source === "library" ? "md:w-1/2" : "md:w-2/3"} flex flex-col items-center sm:w-2/3 xs:w-3/4 w-full space-y-2`}>
                    {loading ? <Loading /> : (
                        exercises.map((exercise, index) => (
                            <button
                                onClick={() => handleOpenExercise(exercise)}
                                key={index}
                                className="bg-gray-100 border-2 border-darkestPurple rounded-md hover:text-xl hover:font-semibold shadow-lg hover:bg-lightPurple text-lg p-2 w-full"
                            >
                                {exercise.exercise_name}
                            </button>
                        ))
                    )}

                </div>
            </div>
            {selectedExercise && (source === "library") && (
                <OverlayWindow
                    headerText={selectedExercise.exercise_name}
                    onClose={handleCloseExercise}
                    className="phones:w-full xs:w-4/5 sm:w-3/5 md:w-1/2 lg:w-1/3"
                    className2="max-h-[75vh] min-h-[65vh]"
                >
                    <ViewLog
                    />
                </OverlayWindow>

            )}
        </div>
    );
};