import { useDispatch } from "react-redux";
import { useSelector } from "react-redux";
import { OverlayWindow } from "../../../components/OverlayWIndow";
import { selectSelectedExercise, setSelectedExercise, setSelectedSet } from "../../../redux-store/LogsSlice";
import { LogForm } from "../AddExercise/LogForm/LogForm";

interface EditExerciseProps {
    setShowEditExercise: (arg0: boolean) => void;
}

export const EditExercise: React.FC<EditExerciseProps> = ({setShowEditExercise}) => {
    const selectedExercise = useSelector(selectSelectedExercise)
    const dispatch = useDispatch();

    const handleCloseEditExercise = () => {
        setShowEditExercise(false);
        dispatch(setSelectedExercise(null));
        dispatch(setSelectedSet(null));
    }

    return (
        <OverlayWindow
        onClose={handleCloseEditExercise}
        headerText={`${selectedExercise?.exercise_name}`}
        className="w-1/3"
        >
            <LogForm 
                source="edit"
            />
        </OverlayWindow>
    )
}