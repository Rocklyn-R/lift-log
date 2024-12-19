import { Workout } from "../../../../types/types"
import { formatNumber } from "../../../../utilities/utilities";
import { FaTrophy } from "react-icons/fa6";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

interface SortableLogProps {
    exercise: Workout
}


export const SortableLog: React.FC<SortableLogProps> = ({ exercise }) => {

    const {
        attributes,
        listeners,
        setNodeRef,
        transform,
        transition,
      } = useSortable({id: exercise.exercise_id});

      const style = {
        transform: CSS.Transform.toString(transform),
        transition,
      };
    
    return (
        <div 
        ref={setNodeRef} 
        {...attributes}
        {...listeners}
        style={style}
        className="bg-gray-100 rounded-md shadow-xl hover:cursor-pointer hover:outline hover:outline-mediumPurple w-full">
            {exercise.sets.length > 0 && (

                <>
                    <h3 className="p-2 border-b-2 border-lightPurple font-semibold text-lg">{exercise.exercise_name}</h3>
                    <div className="p-3 w-full">
                        {exercise.sets.map((set, index) => (
                            <div key={index} className="p-2 grid grid-cols-[0.5fr_1fr_1fr] text-center items-center w-full">
                                <span>{set.pr && <span className="text-mediumPurple flex xs:justify-end justify-center"><FaTrophy /></span>}</span>
                                <span className="flex justify-end w-full">{formatNumber(set.weight)} kgs</span>
                                <span className="flex justify-end w-full">{set.reps} reps</span>
                            </div>
                        ))}
                    </div>
                </>
            )}

        </div>
    )
}