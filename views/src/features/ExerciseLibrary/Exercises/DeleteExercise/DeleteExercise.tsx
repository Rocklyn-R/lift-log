import { useDispatch } from "react-redux";
import { deleteExercise } from "../../../../api/exercises";
import { Button } from "../../../../components/Button";
import { removeExercise } from "../../../../redux-store/LibrarySlice";
import { SelectedExercise } from "../../../../types/types";
import { useState } from "react";
import { deleteAllSets } from "../../../../api/logs";

interface DeleteExerciseProps {
    exercise: SelectedExercise;
    setShowDeleteExercise: (arg0: boolean) => void;
    setExerciseToUpdate: (arg0: null) => void;
}

export const DeleteExercise: React.FC<DeleteExerciseProps> = ({ setExerciseToUpdate, exercise, setShowDeleteExercise }) => {
    const dispatch = useDispatch();
    const [showSuccessMessage, setShowSucessMessage] = useState(false);

    const handleDeleteExercise = async () => {
        const allSetsDeletion = await deleteAllSets(exercise.exercise_id);
        if (allSetsDeletion) {
            const deletion = await deleteExercise(exercise.exercise_id);
            if (deletion) {
                dispatch(removeExercise(exercise));
                setShowSucessMessage(true);
                setTimeout(() => {
                    setShowDeleteExercise(false);
                    setExerciseToUpdate(null);
                }, 2500)
            }
        }

    }

    return (
        <>
            {showSuccessMessage ? (
                <div className="min-h-[5vh] flex items-center justify-center">
                    <span>Exercise successfully deleted!</span>
                </div>

            ) : (
                <div className="min-h-[5vh] flex flex-col items-center justify-center">
                    <span>Would you like to delete {exercise.exercise_name}?</span>
                    <span>This will delete all the data associated with this exercise.</span>
                    <div className="mt-4 space-x-4 flex">
                        <Button type="button" onClick={() => handleDeleteExercise()}>Yes</Button>
                        <Button type="button" onClick={() => {
                            setShowDeleteExercise(false);
                            setExerciseToUpdate(null);
                        }}>Cancel</Button>
                    </div>

                </div>
            )}
        </>
    )
}