import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { useSelector } from "react-redux";
import { getLog } from "../api/logs";
import { selectSelectedDate, setLogsLoading, setWorkout } from "../redux-store/LogsSlice";
import { selectIsAuthenticated } from "../redux-store/UserSlice";
import { Workout } from "../types/types";

export const useLogsFetch = () => {
    const selectedDate = useSelector(selectSelectedDate);
    const dispatch = useDispatch();
    const isAuthenticated = useSelector(selectIsAuthenticated);

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
                            set_id: set.id,
                            pr: set.PR,
                            weight_lbs: set.weight_lbs,
                            rir: set.RIR,
                            rpe: set.RPE,
                            notes: set.notes
                        });
                    } else {
                        // If the exercise is not found, create a new Workout object
                        acc.push({
                            date: set.date,
                            exercise_id: set.exercise_id,
                            exercise_name: set.exercise_name,
                            exercise_order: set.exercise_order,
                            sets: [{
                                weight: set.weight,
                                reps: set.reps,
                                set_number: set.set_number,
                                set_id: set.id,
                                pr: set.PR,
                                weight_lbs: set.weight_lbs,
                                rir: set.RIR,
                                rpe: set.RPE,
                                notes: set.notes
                            }]
                        });
                    }

                    return acc; // Return the updated accumulator (workout array)
                }, [] as Workout[]); // Initialize the accumulator as an empty array of Workout objects

                dispatch(setWorkout(workoutArray)); // Update the workout state
                dispatch(setLogsLoading(false));
            }
        };
        if (isAuthenticated) {
            fetchWorkoutData();
        }
    }, [selectedDate, dispatch, isAuthenticated]);
}