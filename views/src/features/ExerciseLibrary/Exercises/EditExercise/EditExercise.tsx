import { FormEvent, useState } from "react";
import { useSelector } from "react-redux";
import { editExercise, selectCategories, selectExercises } from "../../../../redux-store/LibrarySlice";
import { CustomSelect } from "../../../../components/CustomSelect";
import { Button } from "../../../../components/Button";
import { OverlayWindow } from "../../../../components/OverlayWIndow";
import { SelectedExercise } from "../../../../types/types";
import { updateExercise } from "../../../../api/exercises";
import e from "express";
import { useDispatch } from "react-redux";

interface EditExerciseProps {
    exercise: SelectedExercise;
    setShowEditExercise: (arg0: boolean) => void;
}

export const EditExercise: React.FC<EditExerciseProps> = ({ exercise, setShowEditExercise }) => {
    const [name, setName] = useState(exercise.exercise_name);
    const [category, setCategory] = useState(exercise.category_name);
    const [type, setType] = useState(exercise.type_name);
    const categories = useSelector(selectCategories);
    console.log(categories);
    const types = [{ name: "Weight and Reps", id: 1 }, { name: "Weight and Time", id: 2 }, { name: "Distance and Time", id: 3 }]
    const [nameError, setNameError] = useState("");
    const [categoryError, setCategoryError] = useState("");
    const [typeError, setTypeError] = useState("");
    const [showSuccessMessage, setShowSucessMessage] = useState(false);
    const exercises = useSelector(selectExercises);
    const dispatch = useDispatch();

    const handleUpdateExercise = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const categoryId = categories.find(item => item.name === category)?.id;
        const typeId = types.find(item => item.name === type)?.id;
        if (categoryId && typeId) {
            const update = await updateExercise(name, categoryId, typeId, exercise.exercise_id);
            if (update) {
                dispatch(editExercise({
                    exercise_id: exercise.exercise_id,
                    exercise_name: name,
                    category_name: category,
                    type_name: type
                }))
                setShowSucessMessage(true);
                setShowEditExercise(false);
            }
        }
        
    }

    return (
        <div>
            {showSuccessMessage ? (
                <div className="min-h-[5vh] flex items-center justify-center">
                    <span>Exercise successfully added to library!</span>
                </div>
            ) : (
                <form onSubmit={handleUpdateExercise} 
                    className="h-full flex flex-col justify-evenly">
                    <div className="mb-6 relative">
                        <label htmlFor="name">Name</label>
                        <input
                            value={name}
                            type="text"
                            id="name"
                            name="name"
                            className="mt-2 p-3 w-full border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-darkPurple"
                            placeholder="Name"
                            onChange={(e) => {
                                setName(e.target.value)
                            }}
                        />
                        {!name && <span className="absolute -bottom-5 right-0 px-2 text-sm rounded-md">{nameError}</span>}
                    </div>
                    <div className="mb-4 relative">
                        <label>Category</label>
                        <CustomSelect
                            options={categories}
                            value={category}
                            onChange={(selectedCategory) => setCategory(selectedCategory)}
                            placeholder="Select Category"
                            className="w-full"
                        />
                        <span className="absolute -bottom-5 right-0 px-2 text-sm rounded-md">{categoryError}</span>
                    </div>
                    <div className="mb-4 relative">
                        <label>Type</label>
                        <CustomSelect
                            options={types}
                            value={type}
                            onChange={(selectedType) => {setType(selectedType)
                            console.log(selectedType)}}
                            placeholder="Select Type"
                            className="w-full"
                        />
                        <span className="absolute -bottom-5 right-0 px-2 text-sm rounded-md">{typeError}</span>
                    </div>
                    <div className="w-full flex justify-center p-4">
                        <Button
                            type="submit"
                        >Update</Button>
                    </div>
                </form>
            )}
        </div>
    )
}