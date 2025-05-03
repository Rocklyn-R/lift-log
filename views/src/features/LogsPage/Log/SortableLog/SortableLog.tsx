import { SelectedExercise, Workout } from "../../../../types/types"
import { formatNumber } from "../../../../utilities/utilities";
import { FaTrophy } from "react-icons/fa6";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { useSelector } from "react-redux";
import { selectUnitSystem } from "../../../../redux-store/SettingsSlice";
import { MdDeleteOutline } from "react-icons/md";

import { useDispatch } from "react-redux";
import { setSelectedExercise } from "../../../../redux-store/LogsSlice";


interface SortableLogProps {
    exercise: Workout
    showDeleteMessage: boolean;
    setShowDeleteMessage: (arg0: boolean) => void;
    exerciseToDelete: SelectedExercise | null;
}


export const SortableLog: React.FC<SortableLogProps> = ({ exerciseToDelete, showDeleteMessage, exercise, setShowDeleteMessage }) => {
    const unit_system = useSelector(selectUnitSystem);
    const dispatch = useDispatch();

    const {
        attributes,
        listeners,
        setNodeRef,
        transform,
        transition,
    } = useSortable({
        id: exercise.exercise_id,
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
            style={style}
            className="relative h-full z-10 xs:max-w-[75%] xs:min-w-[75%] lg:min-w-[40%] lg:max-w-[40%] md:min-w-[50%] md:max-w-[50%] sm:min-w-[65%] sm:max-w-[65%] min-w-[95%] max-w-[95%]">
            <>
                {/* Three-Dot Menu */}
                <div className="absolute right-1 top-[1.5rem] -translate-y-1/2 z-10">
                    <div
                        onClick={(e) => {
                            e.stopPropagation();
                            dispatch(setSelectedExercise(exercise))
                            setShowDeleteMessage(true);
                        }}
                        className={`delete-menu p-2 rounded-full cursor-pointer box-border border-2  
              dark:hover:bg-lightestPurple dark:hover:text-darkestPurple dark:hover:border-mediumPurple hover:border-mediumPurple hover:bg-lightPurple
              ${exerciseToDelete?.exercise_id === exercise.exercise_id && showDeleteMessage ? "border-2 dark:border-mediumPurple dark:text-darkestPurple dark:bg-lightestPurple border-mediumPurple bg-lightPurple" : "border-transparent"}`}
                    >
                        <MdDeleteOutline className="w-5 h-5" />
                    </div>
                </div>

            </>
            <div
                {...listeners}
                className={`${showDeleteMessage ? "" : "hover:bg-lightPurple"} dark:bg-darkPurple bg-whitestPurple rounded-md shadow-xl hover:cursor-pointer bo box-border border-2 dark:border-mediumPurple border-mediumPurple w-full`}>
                {exercise.sets.length > 0 && (
                    <>
                    <div className="border-b-2 w-full dark:border-mediumPurple border-mediumPurple">
                        <h3 className="py-2 pl-2  font-semibold text-lg w-[85%]">{exercise.exercise_name}</h3>
                    </div>
                        




                        <div className="p-3 w-full">
                            {exercise.sets.map((set, index) => (
                                <div key={index} className="p-2 grid grid-cols-[0.5fr_1fr_1fr] text-center items-center w-full">
                                    <span>{set.pr && <span className="dark:text-lightestPurple text-mediumPurple flex xs:justify-end justify-center"><FaTrophy /></span>}</span>
                                    {unit_system === "Metric" ? <span className="flex justify-end w-full">{formatNumber(set.weight)} kgs</span> : (
                                        <span className="flex justify-end w-full">{formatNumber(set.weight_lbs)} lbs</span>
                                    )}
                                    <span className="flex justify-end w-full">{set.reps} reps</span>

                                </div>

                            ))}
                        </div>
                    </>
                )}
            </div>
        </div>

    )
}