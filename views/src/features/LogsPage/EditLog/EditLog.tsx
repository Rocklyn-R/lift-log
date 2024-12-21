import { useDispatch } from "react-redux";
import { useSelector } from "react-redux";
import { OverlayWindow } from "../../../components/OverlayWIndow";
import { selectSelectedExercise, setSelectedExercise, setSelectedSet } from "../../../redux-store/LogsSlice";
import { ViewLog } from "../AddLog/ViewLog/ViewLog";

interface EditLogProps {
    setShowEditExercise: (arg0: boolean) => void;
}

export const EditLog: React.FC<EditLogProps> = ({ setShowEditExercise }) => {
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
            className="phones:w-full xs:w-4/5 sm:w-3/5 md:w-1/2 lg:w-1/3"
            className2="min-h-[65vh] max-h-[70vh]"
        >
            <ViewLog
            />
        </OverlayWindow>
    )
}