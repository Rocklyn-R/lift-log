import { useSelector } from "react-redux"
import { selectSelectedSet, selectSetList, setSelectedSet } from "../../../../../redux-store/LogsSlice";
import { MdOutlineMessage } from "react-icons/md";
import { useDispatch } from "react-redux";
import { Set } from "../../../../../types/types";

interface SetDataProps {
    setEditMode: (arg0: boolean) => void;
    setWeightInput: (arg0: string) => void;
    setRepsInput: (arg0: number) => void;
}

export const SetData: React.FC<SetDataProps> = ({ setEditMode, setWeightInput, setRepsInput }) => {
    const setList = useSelector(selectSetList);
    const dispatch = useDispatch();
    const selectedSet = useSelector(selectSelectedSet);

    const handleSelectSet = (set: Set) => {
        dispatch(setSelectedSet(set))
        setEditMode(true);
        setWeightInput(set.weight.toFixed(1));
        setRepsInput(set.reps);
    }

    return (
        <div className="flex w-full overflow-y-auto flex-col my-2 px-2">
            {setList.map((set, index) => (
                <button onClick={() => handleSelectSet(set)} key={index} className={`${selectedSet.number === index + 1 && 'bg-lightPurple'} flex w-full justify-around items-center text-darkestPurple py-2 border-b-2 border-lightPurple hover:bg-lightPurple`}>
                    <div className="text-mediumPurple"><MdOutlineMessage /></div>
                    <p>{index + 1}</p>
                    <p>{set.weight.toFixed(1)} kgs</p>
                    <p>{set.reps} reps</p>
                </button>
            ))}
        </div>
    )
}