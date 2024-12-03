import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { getCategories, getExercises } from "../../../api/exercises";
import { selectCategories, setCategories, setExercises } from "../../../redux-store/LibrarySlice";
import { Exercises } from "../Exercises/Exercises";

interface ExerciseCategoriesProps {
    source: "logs" | "library",
    handleShowExercises?: () => void;
}

export const ExerciseCategories: React.FC<ExerciseCategoriesProps> = ({ source, handleShowExercises }) => {
    const [showCategories, setShowCategories] = useState(true);
    const [showExercises, setShowExercises] = useState(false);
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
    }, []);

    const handleGetExercises = async (category_id: number) => {
        const exercisesFetch = await getExercises(category_id);
        if (exercisesFetch) {
            dispatch(setExercises(exercisesFetch));
        }
        if (source === "library") {
           navigate(`/exercise-library/${category_id}`) 
        } else if (source === 'logs' && handleShowExercises){
            handleShowExercises();
        }
    }

    return (
        
        <div className="flex-grow flex items-center my-4 w-full justify-center">
            <div className="flex flex-col items-center justify-around rounded-md w-1/2 space-y-2">
               {categories.map((category, index) => (
                <button
                    onClick={() => handleGetExercises(category.id)}
                    key={index}
                    className="border-2 border-darkestPurple rounded-md hover:text-xl hover:font-semibold shadow-lg hover:bg-lightPurple text-lg p-2 w-full"
                >{category.name}
                </button>
            ))}
    
            </div>
            
        </div>
    )
}