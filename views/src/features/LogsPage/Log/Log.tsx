import { useDispatch } from "react-redux";
import { useSelector } from "react-redux"
import { reorderExercises } from "../../../api/logs";
import { setWorkout, selectSelectedDate, selectWorkout, setSelectedExercise, updateExerciseOrder } from "../../../redux-store/LogsSlice"
import { DndContext, DragEndEvent, TouchSensor, MouseSensor, useSensor, useSensors } from "@dnd-kit/core";
import { arrayMove, SortableContext } from "@dnd-kit/sortable";
import { SortableLog } from "./SortableLog/SortableLog";


interface LogProps {
    setShowEditExercise: (arg0: boolean) => void;
}

export const Log: React.FC<LogProps> = ({ setShowEditExercise }) => {
    const selectedDate = useSelector(selectSelectedDate);
    const dispatch = useDispatch();
    const workout = useSelector(selectWorkout);


    const handleDragEnd = (event: DragEndEvent) => {
        const { active, over } = event;
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
        } else {
            const foundExercise = workout.find(exercise => exercise.exercise_id === active.id);
            dispatch(setSelectedExercise(foundExercise));
            setShowEditExercise(true);
        }
    }

    const sensors = useSensors(
        useSensor(MouseSensor), // For desktop
        useSensor(TouchSensor, {
            activationConstraint: {
                delay: 250, // Delay before drag starts
                tolerance: 5, // Allow small movements before activating drag
            }
        }) // For mobile
    );

    return (
        <div className="space-y-4 dark:text-lightestPurple text-darkPurple font-semibold xs:w-3/4 sm:w-1/2 md:w-2/5 lg:w-1/3">
            <DndContext
                sensors={sensors}
                onDragEnd={handleDragEnd}
            >
                <SortableContext items={workout.map((exercise) => exercise.exercise_id)}>
                    {workout.map((exercise, index) => (
                        <SortableLog
                            key={exercise.exercise_id}
                            exercise={exercise}
                        />
                    ))}
                </SortableContext>

            </DndContext>

        </div>
    );
} 