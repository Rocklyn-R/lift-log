import { MdLogout } from "react-icons/md";
import { useDispatch } from "react-redux";
import { logoutUser } from "../../api/users";
import { setIsAuthenticated } from "../../redux-store/UserSlice";


export const SignOut = () => {
    const dispatch = useDispatch();

    const handleSignOutUser = async () => {
        await logoutUser();
        dispatch(setIsAuthenticated(false));
    }


    return (
        <div>
            <button
                onClick={() => handleSignOutUser()}
                className="hover:underline w-full text-lightestPurple p-4 flex items-center space-x-2">
                <MdLogout className="text-2xl" />
                <p>Sign Out</p>
            </button>
        </div>
    )
}