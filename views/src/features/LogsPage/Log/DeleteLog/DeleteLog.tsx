import { useSelector } from "react-redux"
import { Button } from "../../../../components/Button";
import { OverlayWindow } from "../../../../components/OverlayWIndow"
import { selectSelectedDate } from "../../../../redux-store/LogsSlice"
import { Workout } from "../../../../types/types";
import { formatDateForHistory } from "../../../../utilities/utilities";

interface DeleteLogProps {
    setShowDeleteMessage: (arg0: boolean) => void;
    exercise: Workout | null;
    setExerciseToDelete: (arg0: Workout | null) => void;
}

export const DeleteLog: React.FC<DeleteLogProps> = ({setExerciseToDelete, setShowDeleteMessage, exercise}) => {
    const selectDate = useSelector(selectSelectedDate);
    return (
        <OverlayWindow
            onClose={() => {
                setExerciseToDelete(null)
                setShowDeleteMessage(false);
            }}
            headerText={`Delete ${exercise?.exercise_name} from ${formatDateForHistory(selectDate)}`}
            className="w-1/3"
            className2="p-4 space-y-4"
        >
           <p>Would you like to delete all sets of {exercise?.exercise_name}?</p> 
           <div className="w-full flex justify-center items-center space-x-4">
            <Button type="button">
                Cancel
            </Button>
            <Button type="button">
                Delete
            </Button>
           </div>

        </OverlayWindow>
    )
}