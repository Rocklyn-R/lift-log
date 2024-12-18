import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { CustomSelect } from "../../../components/CustomSelect";
import { OverlayWindow } from "../../../components/OverlayWIndow"
import { selectCategories } from "../../../redux-store/LibrarySlice";
import { Button } from "../../../components/Button";
import { createNewExercise } from "../../../api/exercises";

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
            console.log("RUNS")
            const createResult = await createNewExercise(name, categoryId, typeId);
            if (createResult) {
                setShowSucessMessage(true);
                setTimeout(() => {
                    setShowAddExercise(false);
                }, 2500)
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
            className="w-1/4"
            className2="p-4"
        > 
        {showSuccessMessage ? (
            <div className="min-h-[5vh] flex items-center justify-center">
                <span>Exercise successfully added to library!</span>
            </div>
        ) : (
             <form onSubmit={handleCreateExercise} className="h-full flex flex-col justify-evenly">
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