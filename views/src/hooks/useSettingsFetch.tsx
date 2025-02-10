import { useEffect } from "react"
import { useDispatch } from "react-redux";
import { useSelector } from "react-redux";
import { getSettings } from "../api/settings";
import { changeUnitSystem } from "../redux-store/SettingsSlice";
import { selectIsAuthenticated } from "../redux-store/UserSlice";

export const useSettingsFetch = () => {
    const isAuthenticated = useSelector(selectIsAuthenticated);
    const dispatch = useDispatch();

    useEffect(() => {
        const fetchSettings = async () => {
            const settings = await getSettings();
            const unit_system_formated = (settings.unit_system.charAt(0).toUpperCase() + settings.unit_system.slice(1).toLowerCase());
            if (settings) {
                dispatch(changeUnitSystem(unit_system_formated));
            }
        }
         if (isAuthenticated) {
            fetchSettings();
        }
    }, [isAuthenticated, dispatch]);
}