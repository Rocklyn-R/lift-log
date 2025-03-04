import { useDispatch } from "react-redux";
import { useSelector } from "react-redux";
import { OverlayWindow } from "../../../components/OverlayWIndow";
import { selectSelectedExercise, updateExerciseOrder, selectWorkout, setSelectedExercise, setSelectedSet, selectSelectedDate } from "../../../redux-store/LogsSlice";
import { ViewLog } from "../AddLog/ViewLog/ViewLog";
import { reorderExercises } from "../../../api/logs";

interface EditLogProps {
    setShowEditExercise: (arg0: boolean) => void;
}

export const EditLog: React.FC<EditLogProps> = ({ setShowEditExercise }) => {
    const selectedExercise = useSelector(selectSelectedExercise)
    const dispatch = useDispatch();
    const workout = useSelector(selectWorkout);
    const selectedDate = useSelector(selectSelectedDate);

    const changeExerciseOrder = () => {
        console.log(selectedExercise)
        const exerciseInWorkout = workout.find(exercise => exercise.exercise_id === selectedExercise?.exercise_id);
        console.log(exerciseInWorkout);
        if (!exerciseInWorkout) {
            workout.forEach(async (exercise, index) => {
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
        } else return;

    }

    const handleCloseEditExercise = () => {
        setShowEditExercise(false);
        changeExerciseOrder();
        dispatch(setSelectedExercise(null));
        dispatch(setSelectedSet(null));
    }




    return (
        <OverlayWindow
            onClose={handleCloseEditExercise}
            headerText={`${selectedExercise?.exercise_name}`}
            className="phones:w-full xs:w-4/5 sm:w-3/5 md:w-1/2 lg:w-1/3"
            className2="min-h-[65vh] max-h-[70vh] dark:bg-darkestPurple"
        >
            <ViewLog
            />
        </OverlayWindow>
    )
}