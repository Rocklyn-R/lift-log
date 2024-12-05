import { useSelector } from "react-redux"
import { selectSetList } from "../../../../redux-store/LogsSlice";
import { MdOutlineMessage } from "react-icons/md";


export const SetData = () => {
    const setList = useSelector(selectSetList);

    return (
        <div className="flex w-full overflow-y-auto flex-col">
            {setList.map((set, index) => (
                <div className="flex w-full justify-around text-darkestPurple">
                    <button className="text-mediumPurple"><MdOutlineMessage /></button>
                    <p>{index + 1}</p>
                    <p>{set.weight.toFixed(1)} kgs</p>
                    <p>{set.reps} reps</p>
                </div>
            ))}
        </div>
    )
}