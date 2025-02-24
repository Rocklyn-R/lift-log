import { Workout } from "../../../../types/types"
import { formatNumber } from "../../../../utilities/utilities";
import { FaTrophy } from "react-icons/fa6";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { useSelector } from "react-redux";
import { selectUnitSystem } from "../../../../redux-store/SettingsSlice";

interface SortableLogProps {
    exercise: Workout
}


export const SortableLog: React.FC<SortableLogProps> = ({ exercise }) => {
    const unit_system = useSelector(selectUnitSystem);

    const {
        attributes,
        listeners,
        setNodeRef,
        transform,
        transition,
        isDragging
      } = useSortable({
        id: exercise.exercise_id,
        animateLayoutChanges: () => true
    });

  const style = {
        transform: CSS.Translate.toString(transform),
        transition,
        height: 'auto', 
  }

  
    
    return (
        <div 
        ref={setNodeRef} 
        {...attributes}
        {...listeners}
        style={style}
        className="dark:bg-darkPurple bg-gray-100 rounded-md shadow-xl hover:cursor-pointer bo box-border border-2 dark:border-mediumPurple border-lightPurple w-full">
            {exercise.sets.length > 0 && (
                <>
                    <h3 className="p-2 border-b-2 border-lightPurple font-semibold text-lg">{exercise.exercise_name}</h3>
                    <div className="p-3 w-full">
                        {exercise.sets.map((set, index) => (
                            <div key={index} className="p-2 grid grid-cols-[0.5fr_1fr_1fr] text-center items-center w-full">
                                <span>{set.pr && <span className="dark:text-lightestPurple text-mediumPurple flex xs:justify-end justify-center"><FaTrophy /></span>}</span>
                                {unit_system === "Metric" ? <span className="flex justify-end w-full">{formatNumber(set.weight)} kgs</span> : (
                                    <span className="flex justify-end w-full">{formatNumber(set.weight_lbs)} lbs</span> 
                                ) }
                                <span className="flex justify-end w-full">{set.reps} reps</span>
                            </div>
                        ))}
                    </div>
                </>
            )}
        </div>
    )
}