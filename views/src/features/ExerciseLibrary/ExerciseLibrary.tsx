import { useState } from "react"
import { Header } from "../../components/Header";
import { ExerciseCategories } from "./ExerciseCategories/ExerciseCategories"
import { useParams } from "react-router-dom";
import { Exercises } from "./Exercises/Exercises";


export const ExerciseLibrary = () => {
    const { categoryId } = useParams<{ categoryId?: string }>();
    return (
        <div className="flex flex-col h-screen w-full justify-center">
            {/* Sticky Header */}
            <Header text="Exercise Library" />
            {/* Scrollable content area */}
            <div className="flex-grow overflow-y-auto p-4">
                {/* Conditionally render ExerciseCategories or Exercises based on categoryId */}
                {categoryId ? (
                    <Exercises />
                ) : (
                    <ExerciseCategories />
                )}
            </div>
        </div>
    );
}