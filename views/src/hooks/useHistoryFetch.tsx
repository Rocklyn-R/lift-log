import { useEffect } from "react"
import { useSelector } from "react-redux";
import { selectSelectedExercise } from "../redux-store/LogsSlice";
import { getExerciseHistory } from "../api/logs";
import { Workout } from "../types/types";
import { useDispatch } from "react-redux";
import { setExerciseHistory } from "../redux-store/LogsSlice";

export const useHistoryFetch = () => {
    const selectedExercise = useSelector(selectSelectedExercise);
    const dispatch = useDispatch();

    useEffect(() => {
        const fetchExerciseHistory = async () => {
            if (!selectedExercise) return;

            const historyResults = await getExerciseHistory(selectedExercise.exercise_id);
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

                // Dispatch the organized history to Redux
                dispatch(setExerciseHistory(organizedExercises));
            }
        };
        fetchExerciseHistory();
        return () => {
            dispatch(setExerciseHistory([]))
        }

    }, [selectedExercise, dispatch]);
}