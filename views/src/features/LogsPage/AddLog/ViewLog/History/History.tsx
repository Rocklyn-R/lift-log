import { useEffect, useState } from "react";
import { FaTrophy } from "react-icons/fa6";
import { useDispatch } from "react-redux";
import { useSelector } from "react-redux";
import { getExerciseHistory } from "../../../../../api/logs";
import { selectHistory, selectSelectedExercise, setExerciseHistory } from "../../../../../redux-store/LogsSlice";
import { selectUnitSystem } from "../../../../../redux-store/SettingsSlice";
import { Workout } from "../../../../../types/types";
import { formatDateForHistory, formatNumber } from "../../../../../utilities/utilities";

export const History = () => {
    const selectedExercise = useSelector(selectSelectedExercise);
    const dispatch = useDispatch();
    const exerciseHistory = useSelector(selectHistory);
    const unit_system = useSelector(selectUnitSystem);
    const [loading, setLoading] = useState(true);

  

    return (
        <div className="p-4 min-h-[55vh] max-h-[65vh] overflow-y-auto font-semibold dark:bg-darkestPurple dark:text-lightestPurple">
            
            {exerciseHistory.map((exercise, index) => (
                <div key={index}>
                    <h3 className="border-b-2 border-lightPurple">{formatDateForHistory(exercise.date)}</h3>
                    {exercise.sets.map((set, index) => (
                        <div key={index} className="p-2 grid grid-cols-3 text-center items-center">
                            <span>{set.pr && <span className="dark:text-lightestPurple text-mediumPurple flex justify-end"><FaTrophy /></span>}</span>
                           {unit_system === "Metric" ? (
                            <span className="flex justify-end">{formatNumber(set.weight)} kgs</span>
                           ) :  <span className="flex justify-end">{formatNumber(set.weight_lbs)} lbs</span>}
                            <span className="flex justify-end">{set.reps} reps</span>
                        </div>
                    ))}

                </div>
            ))}

        </div>
    )
}