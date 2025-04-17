import { useState } from "react";
import { useSelector } from "react-redux";
import { editExercise, selectCategories, selectExercises } from "../../../../redux-store/LibrarySlice";
import { CustomSelect } from "../../../../components/CustomSelect";
import { Button } from "../../../../components/Button";
import { SelectedExercise } from "../../../../types/types";
import { updateExercise } from "../../../../api/exercises";
import { useDispatch } from "react-redux";
import { CustomTextInput } from "../../../../components/CustomTextInput";

interface EditExerciseProps {
    exercise: SelectedExercise;
    setShowEditExercise: (arg0: boolean) => void;
    setExerciseToUpdate: (arg0: null) => void;
}

export const EditExercise: React.FC<EditExerciseProps> = ({ setExerciseToUpdate, exercise, setShowEditExercise }) => {
    const [name, setName] = useState(exercise.exercise_name);
    const [category, setCategory] = useState(exercise.category_name);
    const [type, setType] = useState(exercise.type_name);
    const categories = useSelector(selectCategories);
    const types = [{ name: "Weight and Reps", id: 1 }, { name: "Weight and Time", id: 2 }, { name: "Distance and Time", id: 3 }]
    const [categoryError, setCategoryError] = useState("");
    const [typeError, setTypeError] = useState("");
    const [showSuccessMessage, setShowSucessMessage] = useState(false);
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
                    setTimeout(() => {
                        setShowEditExercise(false);
                        setExerciseToUpdate(null);
                    }, 2500)
            }
        }
    }

    return (
        <div className="dark:text-lightestPurple">
            {showSuccessMessage ? (
                <div className="min-h-[5vh] flex items-center justify-center">
                    <span>Exercise successfully updated!</span>
                </div>
            ) : (
                <form onSubmit={handleUpdateExercise} 
                    className="h-full flex flex-col justify-evenly">
                    <div className="mb-6 relative">
                        <label htmlFor="name">Name</label>
                        <CustomTextInput
                            value={name}
                            name="name"
                            className="mt-2 p-3 w-full border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-darkPurple"
                            placeholder="Name"
                            onChange={setName}
                            required
                        />
                        {!name && <span className="absolute -bottom-5 right-0 px-2 text-sm rounded-md"></span>}
                    </div>
                    <div className="mb-4 relative">
                        <label>Category</label>
                        <CustomSelect
                            options={categories}
                            value={category}
                            onChange={(selectedCategory) => setCategory(selectedCategory)}
                            placeholder="Select Category"
                            className="w-full mt-2"
                        />
                        <span className="absolute -bottom-5 right-0 px-2 text-sm rounded-md">{categoryError}</span>
                    </div>
                    <div className="mb-4 relative">
                        <label>Type</label>
                        <CustomSelect
                            options={types}
                            value={type}
                            onChange={(selectedType) => {setType(selectedType)
                            }}
                            placeholder="Select Type"
                            className="w-full mt-2"
                        />
                        <span className="absolute -bottom-5 right-0 px-2 text-sm rounded-md">{typeError}</span>
                    </div>
                    <div className="w-full flex justify-center p-4 space-x-4">
                        <Button
                            type="submit"
                        >Update</Button>
                         <Button
                            type="button"
                            onClick={() => {
                                setShowEditExercise(false);
                                setExerciseToUpdate(null)
                            }}
                        >Cancel</Button>
                    </div>
                </form>
            )}
        </div>
    )
}