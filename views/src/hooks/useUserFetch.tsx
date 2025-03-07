import { useEffect } from "react";
import { useDispatch } from "react-redux"
import { getSettings } from "../api/settings";
import { checkAuthentication } from "../api/users";
import { setUserFirstName, setUserLastName, setUserEmail, setIsAuthenticated } from "../redux-store/UserSlice";

export const useUserFetch = () => {
    const dispatch = useDispatch();

    useEffect(() => {
        const authorizationCheck = async () => {
            const response = await checkAuthentication();
            if (response.user) {
                dispatch(setIsAuthenticated(true));
                dispatch(setUserFirstName(response.user.first_name));
                dispatch(setUserLastName(response.user.last_name));
                dispatch(setUserEmail(response.user.email));
            }
            else if (response.error) {
                dispatch(setIsAuthenticated(false))
            } 
        }
        authorizationCheck();
    }, [dispatch])
}
