import { useDispatch } from "react-redux";
import { useSelector } from "react-redux";
import { OverlayWindow } from "../../../components/OverlayWIndow";
import { selectSelectedExercise, setSelectedExercise, setSelectedSet } from "../../../redux-store/LogsSlice";
import { ViewLog } from "../AddLog/ViewLog/ViewLog";

interface EditLogProps {
    setShowEditExercise: (arg0: boolean) => void;
}

export const EditLog: React.FC<EditLogProps> = ({setShowEditExercise}) => {
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
            <ViewLog 
            />
        </OverlayWindow>
    )
}