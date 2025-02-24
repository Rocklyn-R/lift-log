import { useEffect, useState } from "react";
import { useSelector } from "react-redux"
import { confirmNewEmail } from "../../../api/settings";
import { Header } from "../../../components/Header";
import { selectIsAuthenticated, setUserEmail } from "../../../redux-store/UserSlice"
import { useNavigate, useParams } from "react-router-dom";
import { Loading } from "../../../components/Loading";
import { useDispatch } from "react-redux";
import { setPendingEmail } from "../../../redux-store/SettingsSlice";

export const ConfirmEmail = () => {
    const isAuthenticated = useSelector(selectIsAuthenticated);
    const { token } = useParams();
    const [successMessage, setSuccessMessage] = useState("");
    const [newEmail, setNewEmail] = useState("");
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();
    const [failMessage, setFailMessage] = useState("");
    const dispatch = useDispatch();

    useEffect(() => {
        const confirmEmail = async () => {
            const response = await confirmNewEmail(token!);
            console.log(response);
            if (response.length > 0) {
                if (response[0].pending_email !== null) {
                    console.log(response)
                    setNewEmail(response[0].pending_email);
                    setSuccessMessage("Your email has been updated!");
                    dispatch(setUserEmail(response[0].pending_email));
                    dispatch(setPendingEmail(""));
                    setLoading(false);
                } else {
                    setFailMessage("This link has expired.")
                    setLoading(false);
                    if (isAuthenticated) {
                        setTimeout(() => {
                            navigate('/settings')
                        }, 3000)
                    }
                }
            } else {
                setFailMessage("This page does not exist.");
                setLoading(false);
                if (isAuthenticated) {
                    setTimeout(() => {
                        navigate('/settings')
                    }, 3000)
                }
            }
        }
        confirmEmail();
    }, [])

    if (loading) {
        return (
            <div className="h-full">
                {isAuthenticated ? <Header text="Settings" /> : <Header text="Welcome to LogLift" />}
                <div className="w-full h-4/5 flex items-center justify-center">
                    <Loading />
                </div>
            </div>
        )
    }

    return (
        <div className="flex h-full flex-col items-center dark:text-lightestPurple">
            {isAuthenticated ? <Header text="Settings" /> : <Header text="Welcome to LogLift" />}
            {successMessage && newEmail ? (
                <div className="h-2/3 flex flex-col justify-center items-center">
                    <span className="font-semibold mb-2">{successMessage}</span>
                    <span className="flex items-center rounded-md border-2 dark:border-mediumPurple dark:bg-darkPurple dark:text-lightestPurple font-semibold mt-2 min-h-12 p-3 w-fit bg-white justify-center">{newEmail}</span>
                </div>
            ) : (
                <div className="h-4/5 flex justify-center items-center">
                    <span>{failMessage}</span>
                </div>
            )}


        </div>
    )
}