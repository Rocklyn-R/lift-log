import { useEffect } from "react"
import { useDispatch } from "react-redux";
import { useSelector } from "react-redux"
import { getLog } from "../../../api/logs";
import { setWorkout, selectSelectedDate, selectWorkout, setSelectedExercise } from "../../../redux-store/LogsSlice"
import { Exercise, Workout } from "../../../types/types";
import { formatNumber } from "../../../utilities/utilities";

interface LogProps {
    setShowEditExercise: (arg0: boolean) => void;
}

export const Log: React.FC<LogProps> = ({ setShowEditExercise }) => {
    const selectedDate = useSelector(selectSelectedDate);
    const dispatch = useDispatch();
    const workout = useSelector(selectWorkout);

    useEffect(() => {
        const fetchWorkoutData = async () => {
            const workoutFetchResults = await getLog(selectedDate);
            if (workoutFetchResults) {
                const workoutArray = workoutFetchResults.reduce((acc: Workout[], set: any) => {
                    // Find if the exercise already exists in the workout array
                    const existingExercise = acc.find(workout => workout.exercise_id === set.exercise_id);

                    // If the exercise is found, push the new set to its sets array
                    if (existingExercise) {
                        existingExercise.sets.push({
                            weight: set.weight,
                            reps: set.reps,
                            set_number: set.set_number,
                        });
                    } else {
                        // If the exercise is not found, create a new Workout object
                        acc.push({
                            date: set.date, // Add the date
                            exercise_id: set.exercise_id,
                            exercise_name: set.exercise_name, // Make sure the exercise_name is available in your data
                            exercise_order: set.exercise_order, // You may need to map this based on your data
                            sets: [{
                                weight: set.weight,
                                reps: set.reps,
                                set_number: set.set_number,
                            }]
                        });
                    }

                    return acc; // Return the updated accumulator (workout array)
                }, [] as Workout[]); // Initialize the accumulator as an empty array of Workout objects

                dispatch(setWorkout(workoutArray)); // Update the workout state
            }
        };
        fetchWorkoutData();
    }, [selectedDate, dispatch]);

    const handleSelectExercise = (exercise: Workout) => {
        dispatch(setSelectedExercise(exercise));
        setShowEditExercise(true);
    }

    return (
        <div className="space-y-4">
            {workout.map(exercise => (
                <div onClick={() => handleSelectExercise(exercise)} className="bg-gray-100 rounded-md shadow-xl hover:cursor-pointer hover:bg-lightPurple">
                    <h3 className="p-2 border-b-2 border-lightPurple font-semibold text-lg">{exercise.exercise_name}</h3>
                    {exercise.sets.map(set => (
                        <div className="p-2 flex justify-end space-x-20">
                            <span>{set.set_number}</span>

                            <span>{formatNumber(set.weight)} kgs</span>
                            <span>{set.reps} reps</span>
                        </div>
                    ))}

                </div>
            ))}

        </div>

    )
}