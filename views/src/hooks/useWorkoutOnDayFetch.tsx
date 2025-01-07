import { useEffect } from "react";
import { useSelector } from "react-redux";
import { useDispatch } from "react-redux";
import { selectDateToView, setWorkoutOnDate } from "../redux-store/LogsSlice";
import { getLog } from "../api/logs";
import { Workout } from "../types/types";

export const useWorkoutOnDayFetch = () => {
    const dispatch = useDispatch();
    const dateToView = useSelector(selectDateToView);
    useEffect(() => {
        const fetchWorkoutData = async () => {
            const workoutFetchResults = await getLog(dateToView);
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
                            weight_lbs: set.weight_lbs
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
                                weight_lbs: set.weight_lbs
                            }]
                        });
                    }

                    return acc; // Return the updated accumulator (workout array)
                }, [] as Workout[]); // Initialize the accumulator as an empty array of Workout objects

                dispatch(setWorkoutOnDate(workoutArray)); // Update the workout state
            }
        };

        fetchWorkoutData();
    }, [dateToView, dispatch]);
}