import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { getCategories, getExercises } from "../../../api/exercises";
import { selectCategories, setCategories, setExercises } from "../../../redux-store/LibrarySlice";
import { setSelectedCategory } from "../../../redux-store/LogsSlice";
import { Category } from "../../../types/types";

interface ExerciseCategoriesProps {
    source: "logs" | "library",
    handleShowExercises?: () => void;
}

export const ExerciseCategories: React.FC<ExerciseCategoriesProps> = ({ source, handleShowExercises }) => {
    const categories = useSelector(selectCategories);
    const navigate = useNavigate();

    const dispatch = useDispatch();
    useEffect(() => {
        const categoriesFetch = async () => {
            const exerciseCategories = await getCategories();
            if (exerciseCategories) {
                dispatch(setCategories(exerciseCategories))
            }
        }
        categoriesFetch();
    }, [dispatch]);

    const handleGetExercises = async (category: Category) => {
        const exercisesFetch = await getExercises(category.id);
        if (exercisesFetch) {
            dispatch(setExercises(exercisesFetch));
        }
        if (source === "library") {
           navigate(`/exercise-library/${category.id}`) 
        } else if (source === 'logs' && handleShowExercises){
            handleShowExercises();
            dispatch(setSelectedCategory(category.name))
        }
    }

    return (
        
        <div className="flex items-center my-4 w-full justify-center">
            <div className={`${source === "library" ? "md:w-1/2" : "md:w-2/3"} flex flex-col items-center justify-around rounded-md md:w-1/3 sm:w-2/3 xs:w-3/4 w-full space-y-2`}>
               {categories.map((category, index) => (
                <button
                    onClick={() => handleGetExercises(category)}
                    key={index}
                    className="bg-gray-100 border-2 border-darkPurple text-darkestPurple rounded-md hover:text-xl hover:font-semibold  hover:bg-lightPurple text-lg p-2 w-full"
                >{category.name}
                </button>
            ))}
            </div>
            
        </div>
    )
}