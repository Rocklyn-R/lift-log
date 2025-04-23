import { useEffect } from "react"
import { useDispatch } from "react-redux";
import { useSelector } from "react-redux";
import { changeTrainingGoal, changeBodyCompositionGoal, changeInjuries, setTrainingProfileLoading } from "../redux-store/TrainingProfileSlice";
import { selectIsAuthenticated } from "../redux-store/UserSlice";
import { getTrainingProfile } from "../api/training_profile";

export const useTrainingProfileFetch = () => {
    const isAuthenticated = useSelector(selectIsAuthenticated);
    const dispatch = useDispatch();

    useEffect(() => {
        const fetchTrainingProfile = async () => {
            const trainingProfile = await getTrainingProfile();
            if (trainingProfile) {
                console.log(trainingProfile);
                dispatch(changeTrainingGoal(trainingProfile.training_goal ?? ""));
                dispatch(changeBodyCompositionGoal(trainingProfile.body_composition_goal ?? ""));
                dispatch(changeInjuries(trainingProfile.injuries ?? ""));
                dispatch(setTrainingProfileLoading(false))
            }
        }
         if (isAuthenticated) {
            fetchTrainingProfile();
        }
    }, [isAuthenticated, dispatch]);
}