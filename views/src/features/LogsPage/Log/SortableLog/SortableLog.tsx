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
        className="bg-gray-100 rounded-md shadow-xl hover:cursor-pointer hover:outline hover:outline-mediumPurple">
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
    )
}