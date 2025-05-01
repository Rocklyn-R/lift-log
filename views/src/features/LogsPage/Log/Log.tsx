import { useDispatch } from "react-redux";
import { useSelector } from "react-redux"
import { reorderExercises } from "../../../api/logs";
import { setWorkout, selectSelectedDate, selectWorkout, setSelectedExercise, updateExerciseOrder, selectSelectedExercise } from "../../../redux-store/LogsSlice"
import { DndContext, DragEndEvent, DragMoveEvent, TouchSensor, MouseSensor, useSensor, useSensors } from "@dnd-kit/core";
import { arrayMove, SortableContext } from "@dnd-kit/sortable";
import { SortableLog } from "./SortableLog/SortableLog";
import { useState, useRef } from "react";
import { DeleteLog } from "./DeleteLog/DeleteLog";

interface LogProps {
    setShowEditExercise: (arg0: boolean) => void;
}

export const Log: React.FC<LogProps> = ({ setShowEditExercise }) => {
    const selectedDate = useSelector(selectSelectedDate);
    const dispatch = useDispatch();
    const workout = useSelector(selectWorkout);
    const [showDeleteMessage, setShowDeleteMessage] = useState(false);
    const selectedExercise = useSelector(selectSelectedExercise);
    const isTouchDevice = typeof window !== "undefined" && "ontouchstart" in window;
    console.log(isTouchDevice);
    const dragMoved = useRef(false);


    const handleDragStart = () => {
        dragMoved.current = false;
    };
    
    const handleDragMove = (event: DragMoveEvent) => {
        // First move = this was a drag, not a click
        dragMoved.current = true;
    };

    const handleDragEnd = (event: DragEndEvent) => {
        const { active, over } = event;
         // Reset the dragStarted flag
         const wasDragged = dragMoved.current;

        if (document.querySelector(".delete-menu:hover")) {
      
            return;
        }
        if (over && active.id !== over.id) {
            const oldIndex = workout.findIndex(item => item.exercise_id === active.id);
            const newIndex = workout.findIndex(item => item.exercise_id === over.id);
            const newArray = arrayMove(workout, oldIndex, newIndex);
            newArray.forEach(async (exercise, index) => {
                const newOrder = index + 1;
                const orderChange = await reorderExercises(newOrder, selectedDate, exercise.exercise_id);
                if (orderChange) {
                    const newExercise = {
                        exercise_id: exercise.exercise_id,
                        exercise_order: newOrder
                    }
                    dispatch(updateExerciseOrder(newExercise))
                }
            })
            dispatch(setWorkout(newArray));
        } else if (!wasDragged) {
            const foundExercise = workout.find(exercise => exercise.exercise_id === active.id);
            dispatch(setSelectedExercise(foundExercise));
            setShowEditExercise(true);
        }
    }

// Always call both hooks, then conditionally include them
const mouseSensor = useSensor(MouseSensor);

const touchSensor = useSensor(TouchSensor, {
    activationConstraint: {
        delay: 1000,
        tolerance: 5,
    },
});
const sensors = useSensors(
    mouseSensor,
    ...(isTouchDevice ? [touchSensor] : [])
);


    return (
        <div className="z-10 space-y-4 h-full dark:text-lightestPurple text-darkPurple font-semibold xs:w-3/4 sm:w-1/2 md:w-2/5 lg:w-1/3">
            <DndContext
                sensors={sensors}
                onDragStart={handleDragStart}
                onDragEnd={handleDragEnd}
                onDragMove={handleDragMove}
            >
                <SortableContext items={workout.map((exercise) => exercise.exercise_id)}>
                    {workout.map((exercise, index) => (
                        <SortableLog
                            key={exercise.exercise_id}
                            exercise={exercise}
                            showDeleteMessage={showDeleteMessage}
                            setShowDeleteMessage={setShowDeleteMessage}
                            exerciseToDelete={selectedExercise ? selectedExercise : null}
                        />
                    ))}
                </SortableContext>

            </DndContext>
            {showDeleteMessage && (
                <DeleteLog
                    setShowDeleteMessage={setShowDeleteMessage}
                    exercise={selectedExercise}
                />
            )}
        </div>
    );
} 