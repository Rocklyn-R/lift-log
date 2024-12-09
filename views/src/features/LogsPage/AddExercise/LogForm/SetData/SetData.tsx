import { useSelector } from "react-redux"
import { selectSelectedExercise, selectSelectedSet, selectSetList, selectWorkout, setSelectedSet } from "../../../../../redux-store/LogsSlice";
import { MdOutlineMessage } from "react-icons/md";
import { useDispatch } from "react-redux";
import { Set } from "../../../../../types/types";
import { formatNumber } from "../../../../../utilities/utilities";

interface SetDataProps {
    setEditMode: (arg0: boolean) => void;
    setWeightInput: (arg0: string) => void;
    setRepsInput: (arg0: number) => void;
}

export const SetData: React.FC<SetDataProps> = ({ setEditMode, setWeightInput, setRepsInput }) => {
    const setList = useSelector(selectSetList);
    const dispatch = useDispatch();
    const selectedSet = useSelector(selectSelectedSet);
    const selectedExercise = useSelector(selectSelectedExercise);
    const workout = useSelector(selectWorkout);
    const setArray = workout.find(exercise => exercise.exercise_id === selectedExercise.id)?.sets ?? [];

    const handleSelectSet = (set: Set) => {
        dispatch(setSelectedSet(set))
        setEditMode(true);
        setWeightInput(set.weight);
        setRepsInput(set.reps);
    }

    return (
        <div className="flex w-full overflow-y-auto flex-col my-2 px-2">
            {setArray.map((set, index) => (
                <button onClick={() => handleSelectSet(set)} key={index} className={`${selectedSet.set_number === index + 1 && 'bg-lightPurple'} flex w-full justify-around items-center text-darkestPurple py-2 border-b-2 border-lightPurple hover:bg-lightPurple`}>
                    <div className="text-mediumPurple"><MdOutlineMessage /></div>
                    <p>{index + 1}</p>
                    <p>{formatNumber(set.weight)} kgs</p>
                    <p>{set.reps} reps</p>
                </button>
            ))}
        </div>
    )
}