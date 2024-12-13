import { Exercise } from "../../../types/types";
import { Button } from "../../../components/Button";

interface ViewExerciseProps {
    exercise: Exercise;
}

export const ViewExercise: React.FC<ViewExerciseProps> = ({ exercise }) => {
    return (
        <div className="flex w-full justify-around p-6">
            <Button type="button" onClick={() => {}}>Add to Log</Button>
            <Button type="button" onClick={() => {}}>View Video Demonstration</Button>
        </div>
    )
}