import { useSelector } from "react-redux"
import { Button } from "../../../../components/Button";
import { OverlayWindow } from "../../../../components/OverlayWIndow"
import { deleteExerciseFromWorkout, selectSelectedDate, selectWorkout, setSelectedExercise, updateExerciseOrder } from "../../../../redux-store/LogsSlice"
import { SelectedExercise, Workout } from "../../../../types/types";
import { findPRsOnDelete, formatDateForHistory } from "../../../../utilities/utilities";
import { deleteExerciseFromLog, getExerciseHistory, updatePR, reorderExercises } from "../../../../api/logs";
import { useDispatch } from "react-redux";

interface DeleteLogProps {
    setShowDeleteMessage: (arg0: boolean) => void;
    exercise: SelectedExercise | null;
}

export const DeleteLog: React.FC<DeleteLogProps> = ({ setShowDeleteMessage, exercise }) => {
    const selectedDate = useSelector(selectSelectedDate);
    const dispatch = useDispatch();
    const workout = useSelector(selectWorkout);
    const isLastExercise = exercise?.exercise_order === workout.length;


    const handleDeleteFromLog = async () => {
        setShowDeleteMessage(false);
        dispatch(deleteExerciseFromWorkout(exercise))
        if (exercise) {
            await deleteExerciseFromLog(exercise.exercise_id, selectedDate);
            const historyResults = await getExerciseHistory(exercise.exercise_id);
            if (historyResults) {
                const organizedExercises = historyResults.reduce((result: Workout[], set: any) => {
                    // Check if the date already exists in the result array
                    const existingExercise = result.find(
                        (exercise) => exercise.date === set.date
                    );

                    if (existingExercise) {
                        // Add the set to the existing exercise
                        existingExercise.sets.push({
                            weight: set.weight,
                            reps: set.reps,
                            set_number: set.set_number,
                            set_id: set.id,
                            pr: set.PR,
                            weight_lbs: set.weight_lbs
                        });
                    } else {
                        // Create a new exercise object
                        result.unshift({
                            date: set.date,
                            exercise_id: set.exercise_id,
                            exercise_name: set.exercise_name,
                            exercise_order: set.exercise_order,
                            sets: [
                                {
                                    weight: set.weight,
                                    reps: set.reps,
                                    set_number: set.set_number,
                                    set_id: set.id,
                                    pr: set.PR,
                                    weight_lbs: set.weight_lbs
                                },
                            ],
                        });
                    }

                    return result;
                }, []);

                // Sort by date in descending order (most recent first)
                organizedExercises.sort((a: Workout, b: Workout) => new Date(b.date).getTime() - new Date(a.date).getTime());
                dispatch(setSelectedExercise({}))
                const PRData = findPRsOnDelete(organizedExercises, 'randomString')
                PRData.forEach(async (PR) => await updatePR(true, PR));
            }
            if (!isLastExercise) {
                // Create a filtered version of workout excluding the deleted exercise
                const updatedWorkout = workout.filter(item => item.exercise_id !== exercise.exercise_id);
    
                updatedWorkout.forEach(async (item, index) => {
                    const newOrder = index + 1;
                    const orderChange = await reorderExercises(newOrder, selectedDate, item.exercise_id);
                    if (orderChange) {
                        const newExercise = {
                            exercise_id: item.exercise_id,
                            exercise_order: newOrder
                        };
                        dispatch(updateExerciseOrder(newExercise));
                    }
                });
            }

        }

    }

    return (
        <OverlayWindow
            onClose={() => {
                dispatch(setSelectedExercise({}))
                setShowDeleteMessage(false);
            }}
            headerText={`Delete ${exercise?.exercise_name} from ${formatDateForHistory(selectedDate)}`}
            className="sm:w-[70%] md:w-[55%] lg:w-[40%]"
            className2="p-4 space-y-4 text-center"
        >
            <p>Would you like to delete {exercise?.exercise_name} from your workout?</p>
            <div className="w-full flex justify-center items-center space-x-4">
                <Button type="button" onClick={() => {
                    setShowDeleteMessage(false);
                    dispatch(setSelectedExercise({}))
                }}>
                    Cancel
                </Button>
                <Button type="button" onClick={handleDeleteFromLog}>
                    Delete
                </Button>
            </div>

        </OverlayWindow>
    )
}