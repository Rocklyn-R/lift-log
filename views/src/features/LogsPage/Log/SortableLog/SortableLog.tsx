import { Workout } from "../../../../types/types"
import { formatNumber } from "../../../../utilities/utilities";
import { FaTrophy } from "react-icons/fa6";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { useSelector } from "react-redux";
import { selectUnitSystem } from "../../../../redux-store/SettingsSlice";
import { useState, useRef } from "react";
import { FiMoreVertical } from "react-icons/fi";
import { MdOutlineEdit, MdDeleteOutline } from "react-icons/md";
import { DeleteLog } from "../DeleteLog/DeleteLog";


interface SortableLogProps {
    exercise: Workout
    showDeleteMessage: boolean;
    setShowDeleteMessage: (arg0: boolean) => void;
    setExerciseToDelete: (arg0: Workout) => void;
    exerciseToDelete: Workout | null;
}


export const SortableLog: React.FC<SortableLogProps> = ({ exerciseToDelete, setExerciseToDelete, showDeleteMessage, exercise, setShowDeleteMessage }) => {
    const unit_system = useSelector(selectUnitSystem);
    const dropdownRef = useRef<HTMLDivElement>(null);

    const {
        attributes,
        listeners,
        setNodeRef,
        transform,
        transition,
        isDragging
    } = useSortable({
        id: exercise.exercise_id,
    });

    const style = {
        transform: CSS.Translate.toString(transform),
        transition,
        height: 'auto',
    }



    return (
        <div
        ref={setNodeRef}
        {...attributes}
        style={style}
        className="relative h-full">
               <>
                        {/* Three-Dot Menu */}
                        <div className="absolute right-1 top-[1.5rem] -translate-y-1/2 z-20">
                            <div
                                onClick={(e) => {
                                    e.stopPropagation();
                                    setExerciseToDelete(exercise)
                                    setShowDeleteMessage(true);
                                }}
                                className={`delete-menu p-2 rounded-full cursor-pointer box-border border-2  
              dark:hover:bg-lightestPurple dark:hover:text-darkestPurple dark:hover:border-mediumPurple hover:border-mediumPurple hover:bg-lightPurple
              ${exerciseToDelete?.exercise_id === exercise.exercise_id ? "border-2 dark:border-mediumPurple dark:text-darkestPurple dark:bg-lightestPurple border-mediumPurple bg-lightPurple" : "border-transparent"}`}
                            >
                                <MdDeleteOutline className="w-5 h-5" />
                            </div>
                        </div>

                    </>
             <div
              {...listeners}
            className={`${showDeleteMessage ? "" : "hover:bg-lightPurple"} dark:bg-darkPurple bg-whitestPurple rounded-md shadow-xl hover:cursor-pointer bo box-border border-2 dark:border-mediumPurple border-mediumPurple w-full`}>
            {exercise.sets.length > 0 && (
                <>
                    <h3 className="p-2 border-b-2 dark:border-mediumPurple border-mediumPurple font-semibold text-lg">{exercise.exercise_name}</h3>


                 

                    <div  className="p-3 w-full">
                        {exercise.sets.map((set, index) => (
                            <div key={index} className="p-2 grid grid-cols-[0.5fr_1fr_1fr] text-center items-center w-full">
                                <span>{set.pr && <span className="dark:text-lightestPurple text-mediumPurple flex xs:justify-end justify-center"><FaTrophy /></span>}</span>
                                {unit_system === "Metric" ? <span className="flex justify-end w-full">{formatNumber(set.weight)} kgs</span> : (
                                    <span className="flex justify-end w-full">{formatNumber(set.weight_lbs)} lbs</span>
                                )}
                                <span className="flex justify-end w-full">{set.reps} reps</span>

                            </div>

                        ))}
                    </div>
                </>
            )}
        </div>
        </div>
       
    )
}