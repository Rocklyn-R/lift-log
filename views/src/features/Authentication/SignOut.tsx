import { MdLogout } from "react-icons/md";
import { useDispatch } from "react-redux";
import { logoutUser } from "../../api/users";
import { setIsAuthenticated } from "../../redux-store/UserSlice";

interface SignOutProps {
    isOpen: boolean;
}

export const SignOut: React.FC<SignOutProps> = ({isOpen}) => {
    const dispatch = useDispatch();

    const handleSignOutUser = async () => {
        await logoutUser();
        dispatch(setIsAuthenticated(false));
    }


    return (
        <div className={`${!isOpen && 'absolute bottom-0'}`}>
            <button
                onClick={() => handleSignOutUser()}
                className="hover:underline w-full text-lightestPurple p-4 flex items-center space-x-2">
                <MdLogout className="text-2xl" />
              <p className={`${isOpen ? 'block' : 'xl:block hidden'}`}>Sign Out</p>
            </button>
        </div>
    )
}