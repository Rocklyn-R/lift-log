import { useEffect, useState } from "react";
import { getCategories } from "../../../api/exercises";
import { Categories } from "../../../types/types";

export const ExerciseCategories = () => {
    const [categories, setCategories] = useState([] as Categories[]);
    useEffect(() => {
        const categoriesFetch = async () => {
            const exerciseCategories = await getCategories();
            if (exerciseCategories) {
                setCategories(exerciseCategories)
            }
        }
        categoriesFetch();
    }, [])

    return (
        <div>
            {categories.map((category, index) => (
                <div key={index} className="text-black">{category.name}</div>
            ))}
        </div>
    )
}