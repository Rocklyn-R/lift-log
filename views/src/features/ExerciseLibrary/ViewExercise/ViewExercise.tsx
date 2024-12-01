import { IoCloseSharp } from "react-icons/io5";
import { Exercise } from "../../../types/types";
import { Button } from "../../../components/Button";

interface ViewExerciseProps {
    exercise: Exercise;
}

export const ViewExercise: React.FC<ViewExerciseProps> = ({ exercise }) => {
    return (
        <div className="flex w-full justify-around p-6">
            <Button onClick={() => {}}>Add to Log</Button>
            <Button onClick={() => {}}>View Video Demonstration</Button>
        </div>
    )
}