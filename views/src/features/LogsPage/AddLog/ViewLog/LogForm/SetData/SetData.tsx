import { useSelector } from "react-redux"
import { selectSelectedExercise, selectSelectedSet, selectWorkout, setSelectedSet } from "../../../../../../redux-store/LogsSlice";
import { MdOutlineMessage } from "react-icons/md";
import { useDispatch } from "react-redux";
import { Set } from "../../../../../../types/types";
import { formatNumber } from "../../../../../../utilities/utilities";
import { FaTrophy } from "react-icons/fa6";
import { selectUnitSystem } from "../../../../../../redux-store/SettingsSlice";

interface SetDataProps {
    setEditMode: (arg0: boolean) => void;
    setWeightInput: (arg0: string) => void;
    setRepsInput: (arg0: number) => void;
}

export const SetData: React.FC<SetDataProps> = ({ setEditMode, setWeightInput, setRepsInput }) => {
    const dispatch = useDispatch();
    const selectedSet = useSelector(selectSelectedSet);
    const selectedExercise = useSelector(selectSelectedExercise);
    const workout = useSelector(selectWorkout);
    const setArray = selectedExercise ? workout.find(exercise => exercise.exercise_id === selectedExercise.exercise_id)?.sets ?? [] : [];
    const unit_system = useSelector(selectUnitSystem);

    const handleSelectSet = (set: Set) => {
        dispatch(setSelectedSet({
            ...set,
            exercise_id: selectedExercise?.exercise_id
        }))
        setEditMode(true);
        setWeightInput(formatNumber(set.weight));
        setRepsInput(set.reps);
    }


    return (
        <div className="max-h-[30vh] flex w-full flex-col mt-4 overflow-y-auto mb-2 px-2 ">
            {setArray.map((set, index) => (
                <button
                    onClick={() => handleSelectSet(set)}
                    key={index}
                    className={`${selectedSet?.set_number === set.set_number && 'bg-lightPurple'} flex w-full justify-center items-center text-darkestPurple py-2 border-b-2 border-lightPurple hover:bg-lightPurple`}
                >
                    <div className="text-mediumPurple grid grid-cols-3 gap-4 items-center">
                        <MdOutlineMessage />
                        <span>{set.pr && <FaTrophy />}</span>
                        <span className="w-3/12 flex justify-center text-center">{set.set_number}</span>
                    </div>
                    {unit_system === "metric" ? (
                        <p className="w-1/3 flex justify-end text-center">{formatNumber(set.weight)} kgs</p>
                    ) : (
                        <p className="w-1/3 flex justify-end text-center">{formatNumber(set.weight_lbs)} lbs</p>
                    )}

                    <p className="w-1/3 flex justify-end text-center">{set.reps} reps</p>
                </button>
            ))}
        </div>
    );
}
