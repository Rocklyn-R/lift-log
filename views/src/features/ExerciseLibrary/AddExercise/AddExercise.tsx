import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { CustomSelect } from "../../../components/CustomSelect";
import { OverlayWindow } from "../../../components/OverlayWIndow"
import { addExercise, selectCategories } from "../../../redux-store/LibrarySlice";
import { Button } from "../../../components/Button";
import { createNewExercise } from "../../../api/exercises";
import { useDispatch } from "react-redux";

interface AddExerciseProps {
    setShowAddExercise: (arg0: boolean) => void;
}

export const AddExercise: React.FC<AddExerciseProps> = ({ setShowAddExercise }) => {
    const [name, setName] = useState("");
    const [category, setCategory] = useState("");
    const [type, setType] = useState("");
    const categories = useSelector(selectCategories);
    const types = [{ name: "Weight and Reps", id: 1 }, { name: "Weight and Time", id: 2 }, { name: "Distance and Time", id: 3 }]
    const [nameError, setNameError] = useState("");
    const [categoryError, setCategoryError] = useState("");
    const [typeError, setTypeError] = useState("");
    const [showSuccessMessage, setShowSucessMessage] = useState(false);
    const dispatch = useDispatch();

    const handleCreateExercise = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();

        let hasError = false;

        if (!name) {
            setNameError("Please fill out this field.");
            hasError = true;
        }

        if (!category) {
            setCategoryError("Please select one.");
            hasError = true;
        }

        if (!type) {
            setTypeError("Please select one.");
            hasError = true;
        }

        if (hasError) {
            return; // Do not proceed with form submission if there are errors
        }
        const categoryId = categories.find(cat => cat.name === category)?.id;
        const typeId = types.find(item => item.name === type)?.id;
        if (name && categoryId && typeId) {
            const createResult = await createNewExercise(name, categoryId, typeId);
            if (createResult) {
                const typeName = types.find(type => type.id === createResult[0].type)?.name;
                if (typeName) {
                    const exerciseObject = {
                        exercise_id: createResult[0].id,
                        exercise_name: name,
                        category_name: category,
                        type_name: typeName
                    }
                    dispatch(addExercise(exerciseObject))
                    setShowSucessMessage(true);
                    setTimeout(() => {
                        setShowAddExercise(false);
                    }, 2500)
                }

            }
        }
    }

    useEffect(() => {
        if (name) {
            setNameError("")
        }
        if (category) {
            setCategoryError("")
        }
        if (type) {
            setTypeError("")
        }
    }, [name, category, type])

    return (
        <OverlayWindow
            headerText="New Exercise"
            onClose={() => setShowAddExercise(false)}
            className="dark:bg-darkestPurple dark:font-semibold phones:w-full xs:w-4/5 sm:w-3/5 md:w-1/2 lg:w-1/3"
            className2="p-4"
        >
            {showSuccessMessage ? (
                <div className="min-h-[5vh] flex items-center justify-center">
                    <span>Exercise successfully added to library!</span>
                </div>
            ) : (
                <form onSubmit={handleCreateExercise} className="h-full flex flex-col justify-evenly">
                    <div className="mb-6 relative">
                        <label className="dark:text-lightestPurple font-semibold" htmlFor="name">Name</label>
                        <input
                            value={name}
                            type="text"
                            id="name"
                            name="name"
                            className="dark:bg-darkPurple dark:text-lightestPurple mt-2 p-3 w-full border-2 border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-darkPurple"
                            placeholder="Name"
                            onChange={(e) => {
                                setName(e.target.value)
                            }}
                        />
                        {!name && <span className="absolute -bottom-5 right-0 px-2 text-sm rounded-md">{nameError}</span>}
                    </div>
                    <div className="mb-4 relative">
                        <label className="dark:text-lightestPurple font-semibold">Category</label>
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
                        <label className="dark:text-lightestPurple font-semibold">Type</label>
                        <CustomSelect
                            options={types}
                            value={type}
                            onChange={(selectedType) => setType(selectedType)}
                            placeholder="Select Type"
                            className="w-full"
                        />
                        <span className="absolute -bottom-5 right-0 px-2 text-sm rounded-md">{typeError}</span>
                    </div>
                    <div className="w-full flex justify-center p-4">
                        <Button
                            type="submit"
                        >Create</Button>
                    </div>
                </form>
            )}

        </OverlayWindow>
    )
}