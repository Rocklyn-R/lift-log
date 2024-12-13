import { useEffect } from "react"
import { useDispatch } from "react-redux";
import { useSelector } from "react-redux"
import { getLog } from "../../../api/logs";
import { setWorkout, selectSelectedDate, selectWorkout, setSelectedExercise } from "../../../redux-store/LogsSlice"
import { Workout } from "../../../types/types";
import { formatNumber } from "../../../utilities/utilities";
import { FaTrophy } from "react-icons/fa";


interface LogProps {
    setShowEditExercise: (arg0: boolean) => void;
}

export const Log: React.FC<LogProps> = ({ setShowEditExercise }) => {
    const selectedDate = useSelector(selectSelectedDate);
    const dispatch = useDispatch();
    const workout = useSelector(selectWorkout);



    const handleSelectExercise = (exercise: Workout) => {
        dispatch(setSelectedExercise(exercise));
        setShowEditExercise(true);
    }

    return (
        <div className="space-y-4 text-darkPurple">
            {workout.map((exercise, index) => (
                <div key={index} onClick={() => handleSelectExercise(exercise)} className="bg-gray-100 rounded-md shadow-xl hover:cursor-pointer hover:outline hover:outline-mediumPurple">
                    {exercise.sets.length > 0 && (
                        <>
                            <h3 className="p-2 border-b-2 border-lightPurple font-semibold text-lg">{exercise.exercise_name}</h3>
                            <div className="p-3">
                                {exercise.sets.map((set, index) => (
                                    <div key={index} className="p-2 grid grid-cols-3 text-center items-center">
                                        <span>{set.pr && <span className="text-mediumPurple flex justify-end"><FaTrophy /></span>}</span>
                                        <span className="flex justify-end">{formatNumber(set.weight)} kgs</span>
                                        <span className="flex justify-end">{set.reps} reps</span>
                                    </div>
                                ))}
                            </div>
                        </>
                    )}

                </div>
            ))}
        </div>
    );
}