import { useSelector } from "react-redux";
import { OverlayWindow } from "../../../../../components/OverlayWIndow";
import { selectSelectedDate, selectWorkout, selectWorkoutToCopy, setDateToCopy, setWorkoutOnDate, setWorkoutToCopy } from "../../../../../redux-store/LogsSlice";
import { formatDateForHistory } from "../../../../../utilities/utilities";
import { Button } from "../../../../../components/Button";
import { useDispatch } from "react-redux";
import { addSetToLog } from "../../../../../api/logs";
import { addExerciseToWorkout } from "../../../../../redux-store/LogsSlice";


interface CopyMessageProps {
    setShowCopyMessage: (arg0: boolean) => void;
    setShowCopyDay: (arg0: boolean) => void;
}

export const CopyMessage: React.FC<CopyMessageProps> = ({ setShowCopyMessage, setShowCopyDay }) => {
    const selectedDate = useSelector(selectSelectedDate);
    const dispatch = useDispatch();
    const workoutToCopy = useSelector(selectWorkoutToCopy);
    const workout = useSelector(selectWorkout);

    const handleCancel = () => {
        setShowCopyMessage(false);
        setShowCopyDay(true);
    }

    const handleSelectCopy = async () => {
        for (const exercise of workoutToCopy) {

            const exerciseOrder = (() => {
                const foundExercise = workout.find(item => item.exercise_id === exercise.exercise_id);
                if (foundExercise) {
                    return foundExercise.exercise_order; // Use the existing exercise_order if found
                } else if (workout.length > 0) {
                    return workoutToCopy.indexOf(exercise) + 1 + workout.length; // Calculate based on index + workout length
                } else {
                    return workoutToCopy.indexOf(exercise) + 1; // Fallback when workout is empty
                }
            })();


            for (const set of exercise.sets) {
                const setNumber = (() => {
                    const foundExerciseIndex = workout.findIndex(item => item.exercise_id === exercise.exercise_id);
                    if (foundExerciseIndex !== -1) {
                        return workout[foundExerciseIndex].sets.length + exercise.sets.indexOf(set) + 1;
                    } else {
                        return exercise.sets.indexOf(set) + 1;
                    }
                })();

                //const setNumber = exercise.sets.indexOf(set) + 1; // Set number (1-based index)
                const setWeight = Number(set.weight);
                // Await the API call
                const addSetResult = await addSetToLog(
                    selectedDate,           // date
                    exercise.exercise_id,    // exercise_id
                    setNumber,               // set_number
                    setWeight,              // weight
                    set.reps,                // reps
                    exerciseOrder            // exercise_order
                );
                dispatch(addExerciseToWorkout(addSetResult));
              /*  const newPRData = await getUpdatedPrs(exercise.exercise_id, selectedDate);
                newPRData.forEach((set: any) => {
                    dispatch(updatePr(set))
                })*/
            }
        }
        setShowCopyMessage(false);
        dispatch(setDateToCopy(""));
        dispatch(setWorkoutOnDate([]));
        dispatch(setWorkoutToCopy([]));
        setShowCopyDay(false)
    };

    return (
        <OverlayWindow
            headerText="Copy Workout"
            onClose={() => setShowCopyMessage(false)}
            className="dark:bg-darkestPurple phones:w-4/5 xs:w-3/5 sm:w-2/5 md:w-1/3 lg:w-1/4"
            className2="flex justify-center p-4 z-50"
        >
            <span>Are you sure you want to copy the selected sets to <span className="font-semibold">{formatDateForHistory(selectedDate)}</span>?</span>
            <div className="w-full flex justify-center space-x-6 mt-4">
                <Button
                    type="button"
                    onClick={() => handleCancel()}
                >Cancel</Button>
                <Button
                    type="button"
                    onClick={handleSelectCopy}
                >Yes</Button>
            </div>
        </OverlayWindow>
    )
}