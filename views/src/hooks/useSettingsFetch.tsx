import { useEffect } from "react"
import { useDispatch } from "react-redux";
import { useSelector } from "react-redux";
import { getSettings } from "../api/settings";
import { changeTheme, changeUnitSystem, changeEffortScale, setPendingEmail } from "../redux-store/SettingsSlice";
import { selectIsAuthenticated } from "../redux-store/UserSlice";

export const useSettingsFetch = () => {
    const isAuthenticated = useSelector(selectIsAuthenticated);
    const dispatch = useDispatch();

    useEffect(() => {
        const fetchSettings = async () => {
            const settings = await getSettings();
            if (settings) {
                dispatch(changeUnitSystem(settings.unit_system));
                dispatch(changeTheme(settings.theme));
                dispatch(setPendingEmail(settings.pending_email));
                dispatch(changeEffortScale(settings.effort_scale))
            }
        }
         if (isAuthenticated) {
            fetchSettings();
        }
    }, [isAuthenticated, dispatch]);
}