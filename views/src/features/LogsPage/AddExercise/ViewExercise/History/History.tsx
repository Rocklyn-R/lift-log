import { useEffect } from "react";
import { FaTrophy } from "react-icons/fa6";
import { useDispatch } from "react-redux";
import { useSelector } from "react-redux";
import { getExerciseHistory } from "../../../../../api/logs";
import { selectHistory, selectSelectedExercise, setExerciseHistory } from "../../../../../redux-store/LogsSlice";
import { Workout } from "../../../../../types/types";
import { formatDateForHistory, formatNumber } from "../../../../../utilities/utilities";

export const History = () => {
    const selectedExercise = useSelector(selectSelectedExercise);
    const dispatch = useDispatch();
    const exerciseHistory = useSelector(selectHistory);

    const set = {
        pr: true,
        weight: '50.0kg',
        reps: 12
    }

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
                        });
                    } else {
                        // Create a new exercise object
                        result.push({
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
                                },
                            ],
                        });
                    }

                    return result;
                }, []);

                // Dispatch the organized history to Redux
                dispatch(setExerciseHistory(organizedExercises));
            }
        };

        fetchExerciseHistory();
    }, [selectedExercise, dispatch]);

    return (
        <div className="p-4">
            {exerciseHistory.map((exercise, index) => (
                <div key={index}>
                    <h3 className="border-b-2 border-lightPurple">{formatDateForHistory(exercise.date)}</h3>
                    {exercise.sets.map((set, index) => (
                        <div key={index} className="p-2 grid grid-cols-3 text-center items-center">
                            <span>{set.pr && <span className="text-mediumPurple flex justify-end"><FaTrophy /></span>}</span>
                            <span className="flex justify-end">{formatNumber(set.weight)} kgs</span>
                            <span className="flex justify-end">{set.reps} reps</span>
                        </div>
                    ))}

                </div>
            ))}

        </div>
    )
}