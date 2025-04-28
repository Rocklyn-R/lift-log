import { useSelector } from "react-redux"
import { selectSelectedExercise, selectSelectedSet, selectWorkout, setSelectedSet } from "../../../../../../redux-store/LogsSlice";
import { MdOutlineMessage } from "react-icons/md";
import { useDispatch } from "react-redux";
import { Set } from "../../../../../../types/types";
import { formatNumber } from "../../../../../../utilities/utilities";
import { FaTrophy } from "react-icons/fa6";
import { selectUnitSystem } from "../../../../../../redux-store/SettingsSlice";
import { Notes } from "./Notes/Notes";
import { useState } from "react";

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
    const [activeNoteSet, setActiveNoteSet] = useState<Set | null>(null);


    const handleSelectSet = (set: Set) => {
        dispatch(setSelectedSet({
            ...set,
            exercise_id: selectedExercise?.exercise_id
        }))
        setEditMode(true);
        setWeightInput(formatNumber(set.weight));
        setRepsInput(set.reps);
    }

    const handleOpenNotes = (set: Set) => {
        setActiveNoteSet(set);
    }

    return (
        <div className={`max-h-[30vh] ${setArray.length > 4 && "dark:rounded-none rounded-[.2rem]"} font-semibold flex h-full w-full flex-col mt-4 overflow-y-auto dark:mb-0 mx-2 dark:bg-darkPurple bg-lightestPurple`}>
            {setArray.map((set, index) => (
                <div className="relative" key={index}>
                    <div
                        role="button"
                        onClick={() => handleSelectSet(set)}
                        className={`${set.set_number === 1 ? "border-t-2 border-mediumPurple" : "border-t-none"} ${set.set_number === setArray.length && ""} ${set.set_number === setArray.length && set.set_number > 4 && "border-t-transparent border-b-transparent"} ${selectedSet?.set_number === set.set_number && 'bg-lightPurple dark:bg-mediumPurple'} dark:text-lightestPurple flex w-full justify-center items-center text-darkestPurple px-2 border-b-2 border-b-mediumPurple  hover:bg-lightPurple dark:hover:bg-lightestPurple dark:hover:text-darkestPurple`}
                    >
                        <div className="relative p-2 flex w-full items-center justify-center ml-10">
                            {/* This is the icon button (NOT a real <button>) */}

                            {/*TRophy with absolute */}
                            <span className="absolute top-[3.5px] left-[19px] p-2 rounded-full">{set.pr && <FaTrophy />}</span>
                            <span className="w-3/12 flex justify-center text-center">{set.set_number}</span>

                            {unit_system === "Metric" ? (
                                <p className="w-1/3 flex justify-end text-center">{formatNumber(set.weight)} kgs</p>
                            ) : (
                                <p className="w-1/3 flex justify-end text-center">{formatNumber(set.weight_lbs)} lbs</p>
                            )}

                            <p className="w-1/3 flex justify-end text-center">{set.reps} reps</p>
                        </div>
                    </div>
                    <div
                        onClick={() => {
                            handleOpenNotes(set);
                        }}
                        className={`absolute ${index === 0 ? "top-[2px]" : "top-[0px]"} left-5 p-2 rounded-full cursor-pointer box-border border-2 border-transparent 
                      dark:hover:bg-lightestPurple dark:hover:text-darkestPurple dark:hover:border-mediumPurple 
                      hover:border-mediumPurple hover:bg-lightPurple dark:text-lightestPurple`}
                    >
                        <MdOutlineMessage className="w-5 h-5" />
                    </div>
                </div>

            ))}
            {activeNoteSet && <Notes set={activeNoteSet} closeNotes={() => setActiveNoteSet(null)} />}
        </div>
    );
}
