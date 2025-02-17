import { useState } from "react";
import { MdLogout } from "react-icons/md";
import { useDispatch } from "react-redux";
import { logoutUser } from "../../api/users";
import { Loading } from "../../components/Loading";
import { setIsAuthenticated } from "../../redux-store/UserSlice";

interface SignOutProps {
    isOpen: boolean;
}

export const SignOut: React.FC<SignOutProps> = ({isOpen}) => {
    const dispatch = useDispatch();
    const [loading, setLoading] = useState(false);

    const handleSignOutUser = async () => {
        setLoading(true);
        await logoutUser();
        dispatch(setIsAuthenticated(false));
        setLoading(false);
    }


    return (
        <div className={`${!isOpen && 'absolute bottom-0'}`}>
            <button
                onClick={() => handleSignOutUser()}
                className="hover:underline w-full text-lightestPurple p-4 flex items-center space-x-2">
               {!isOpen && loading ? "" : <MdLogout className="text-2xl" />} 
              <p className={`${isOpen ? 'block' : 'xl:block hidden'}`}>Sign Out</p>
              {loading && <Loading size="w-6 h-6" />}
            </button>
        </div>
    )
}