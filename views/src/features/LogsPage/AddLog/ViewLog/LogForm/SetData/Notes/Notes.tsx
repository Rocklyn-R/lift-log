import { useSelector } from "react-redux";
import { OverlayWindow } from "../../../../../../../components/OverlayWIndow"
import { Set } from "../../../../../../../types/types";
import { changeSetNotes, selectSelectedDate, selectSelectedExercise } from "../../../../../../../redux-store/LogsSlice";
import { formatDate } from "../../../../../../../utilities/utilities";
import { useRef, useState, useEffect } from "react";
import { Button } from "../../../../../../../components/Button";
import { CustomSelect } from "../../../../../../../components/CustomSelect";
import { selectEffortScale } from "../../../../../../../redux-store/SettingsSlice";
import { getNotes, updateNotes } from "../../../../../../../api/logs";
import { useDispatch } from "react-redux";

interface NotesProps {
    closeNotes: () => void;
    set: Set;
}

export const Notes: React.FC<NotesProps> = ({ closeNotes, set }) => {
    const selectedExercise = useSelector(selectSelectedExercise);
    const selectedDate = useSelector(selectSelectedDate);
    const [notesInput, setNotesInput] = useState(set.notes || "");
    const [rpe, setRPE] = useState(set.rpe || "");
    const [rir, setRIR] = useState(set.rir || "");
    const effortScale = useSelector(selectEffortScale);
    const dispatch = useDispatch();

 
    const textareaRef = useRef<HTMLTextAreaElement>(null);
    const [isScrollable, setIsScrollable] = useState(false);
    console.log(set);
    const rpeToRirMap: Record<string, string> = {
        "10": "0",
        "9.5": "0.5",
        "9": "1",
        "8.5": "1.5",
        "8": "2",
        "7.5": "2.5",
        "7": "3",
        "6.5": "3.5",
        "6": "4"
    };

    const rirToRpeMap = Object.entries(rpeToRirMap).reduce((acc, [rpe, rir]) => {
        acc[rir] = rpe;
        return acc;
    }, {} as Record<string, string>);

    useEffect(() => {
        if (rpeToRirMap[rpe]) {
            setRIR(rpeToRirMap[rpe]);
        } else if (rpe === "-") {
            setRIR("-");
        }
    }, [rpe]);

    useEffect(() => {
        if (rirToRpeMap[rir]) {
            setRPE(rirToRpeMap[rir]);
        } else if (rir === "-") {
            setRPE("-");
        }
    }, [rir]);

    useEffect(() => {
        if (textareaRef.current) {
            textareaRef.current.style.height = "auto";

            const scrollHeight = textareaRef.current.scrollHeight;
            textareaRef.current.style.height = `${scrollHeight}px`;


            setIsScrollable(scrollHeight > 160);
        }
    }, [notesInput]);

    const handleUpdateNotes = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        closeNotes();
        const payload = {
            exercise_id: selectedExercise?.exercise_id,
            set_id: set.set_id,
            rir: rir,
            rpe: rpe,
            notes: notesInput
        }
        dispatch(changeSetNotes(payload))
        
        await updateNotes(set.set_id, notesInput, rir, rpe);
    }

    return (
        <OverlayWindow
            onClose={closeNotes}
            headerText="Notes"
            className="w-1/3"
            className2="p-4"
        >
            <div className="mb-4 flex flex-col w-full justify-center items-center">
                <span>{selectedExercise?.exercise_name} - {formatDate(selectedDate)}</span>
                <span>Set number: {set.set_number}</span>
                <span>{set.weight} kg x {set.reps} reps</span>
            </div>
            <form className="space-y-4" onSubmit={handleUpdateNotes}>
                {effortScale === "RPE" ? (

                    <div className="flex items-center space-x-2 w-full justify-center">
                        <label>Select RPE:</label>
                        <CustomSelect
                            options={["-", "6", "6.5", "7", "7.5", "8", "8.5", "9", "9.5", "10"]}
                            value={rpe}
                            onChange={(val) => setRPE(val)}
                            className="w-[16.5%]"
                            placeholder="-"
                        />
                    </div>

                ) : (
                    <div>
                        <label>Select RIR:</label>
                        <CustomSelect
                            options={["-", "4", "3.5", "3", "2.5", "2", "1.5", "1", "0.5", "0"]}
                            value={rir}
                            onChange={(val) => setRIR(val)}
                            className="w-[16.5%]"
                            placeholder="-"
                        />
                    </div>
                )}

                <textarea
                    ref={textareaRef}
                    value={notesInput}
                    onChange={(e) => setNotesInput(e.target.value)}

                    placeholder="Write down your notes for this set..."
                    rows={3}
                    className={`border-mediumPurple border-2 dark:bg-darkPurple dark:border-2 dark:border-mediumPurple w-full resize-none dark:text-white rounded-md px-4 pt-2 pb-[0.75rem] focus:outline-none ${isScrollable ? "overflow-y-auto" : "overflow-y-hidden"}`}
                />
                <div className="w-full flex justify-center p-4">
                    <Button
                        type="submit"
                    >Save</Button>
                </div>
            </form>
        </OverlayWindow>
    )
}