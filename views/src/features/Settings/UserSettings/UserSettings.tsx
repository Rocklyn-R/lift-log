import React, { useState } from "react";
import { MdOutlineEdit } from "react-icons/md";
import { useSelector } from "react-redux";
import { selectEmail } from "../../../redux-store/UserSlice";
import { sendConfirmationEmail, updateUserPassword } from "../../../api/settings";
import { CustomPasswordInput } from "../../../components/CustomPasswordInput";
import { CustomTextInput } from "../../../components/CustomTextInput";
import { OverlayWindow } from "../../../components/OverlayWIndow";
import { Button } from "../../../components/Button";
import { Loading } from "../../../components/Loading";
import { selectPendingEmail, setPendingEmail } from "../../../redux-store/SettingsSlice";
import { useDispatch } from "react-redux";

export const UserSettings = () => {
    const email = useSelector(selectEmail)
    const [newEmail, setNewEmail] = useState("");
    const [password, setPassword] = useState('••••••••••••');
    const [showUsername, setShowUserName] = useState(false);
    const [showEditPassword, setShowEditPassword] = useState(false);
    const [newPassword, setNewPassword] = useState("");
    const [newPasswordRepeat, setNewPasswordRepeat] = useState("")
    const [oldPassword, setOldPassword] = useState("");
    const [passwordErrorMessage, setPasswordErrorMessage] = useState("");
    const [statusMessage, setStatusMessage] = useState("");
    const [emailStatusMessage, setEmailStatusMessage] = useState("")
    const [loadingPasswordUpdate, setLoadingPasswordUpdate] = useState(false);
    const pendingEmail = useSelector(selectPendingEmail);
    const dispatch = useDispatch();

    const handleUpdatePassword = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoadingPasswordUpdate(true);
        setPasswordErrorMessage("");
        if (newPassword !== newPasswordRepeat) {
            setPasswordErrorMessage("Passwords don't match.");
            setLoadingPasswordUpdate(false);
            return;
        }
        const passwordUpdated = await updateUserPassword(oldPassword, newPassword);
    
        setOldPassword('');
        setNewPassword('');
        setNewPasswordRepeat('');
        if (passwordUpdated === 'Success') {
            setStatusMessage('Password successfully changed!');
            setTimeout(() => {
                setShowEditPassword(false);
            }, 2000);
            setLoadingPasswordUpdate(false);
        } else if (passwordUpdated === 'Old password incorrect') {
            setPasswordErrorMessage('Current password incorrect.');
            setLoadingPasswordUpdate(false);
        } else {
            setStatusMessage('An error ocurred');
            setLoadingPasswordUpdate(false);
        }
    }

    const handleUpdateEmail = async (e: React.FormEvent) => {
        e.preventDefault();
        if (email === newEmail) {
            setEmailStatusMessage("New email must be different from current email");
            return;
        } 
        dispatch(setPendingEmail(newEmail));
        setShowUserName(false); 
        const confirmationEmail = await sendConfirmationEmail(newEmail);
    
    }

    return (
        <div>
            <h2 className="text-lg font-bold mb-2 dark:text-lightestPurple">User Settings</h2>
            <label className="dark:text-lightestPurple font-semibold">E-mail</label>
            <div className="mb-2 flex items-center justify-between text-darkestPurple w-full">

                <div className="flex w-full justify-between items-center">
                    <span className="flex items-center rounded-md border-2 border-mediumPurple dark:bg-darkPurple dark:text-lightestPurple font-semibold mt-2 min-h-12 p-3 w-fit bg-white justify-center">{email}</span>
                    <button onClick={() => setShowUserName(true)} className="mt-2 dark:border-mediumPurple flex items-center justify-center dark:text-lightestPurple border-2 rounded-full p-1 sm:p-3 h-fit dark:bg-darkPurple dark:hover:bg-lightestPurple dark:hover:text-darkestPurple bg-darkestPurple border-transparent hover:bg-darkPurple text-lightestPurple"><MdOutlineEdit className="text-xl" /></button>
                </div>

                {showUsername && (
                    <OverlayWindow
                        onClose={() => setShowUserName(false)}
                        headerText="Change Email"
                        className="dark:bg-darkestPurple w-full xs:w-3/4 sm:w-1/2 md:w-1/3 lg-w-1/4"
                        className2="p-4 space-y-2 items-center dark:bg-darkestPurple flex justify-center items-center w-full"
                    >
                        <span className="dark:text-lightestPurple font-semibold">Your current email address:</span>
                        <span className="flex items-center w-fit rounded-md border-2 border-mediumPurple dark:bg-darkPurple dark:text-lightestPurple font-semibold mt-2 min-h-12 p-3 bg-white">{email}</span>
                        <span className="dark:text-lightestPurple font-semibold">Please enter your new email address.</span>
                        <span className="dark:text-lightestPurple font-semibold">A confirmation email will be sent.</span>
                        <form onSubmit={handleUpdateEmail} className="flex space-y-4 flex-col justify-center items-center">
                            <CustomTextInput
                                name="username"
                                value={newEmail}
                                onChange={setNewEmail}
                                placeholder="New Email"
                                className="w-fit mb-2"
                            />
                            <div className="flex space-x-4">
                                <Button className="mb-3" onClick={() => setShowUserName(false)} type="button">Cancel</Button>
                                <Button className="mb-3" type="submit">Save</Button>
                            </div>
                        </form>

                    </OverlayWindow>
                )}
            </div>
            {pendingEmail && (
                <>
                    <label className="dark:text-lightestPurple text-darkestPurple font-semibold">Email Pending Confirmation</label>
                    <div className="mt-2 mb-2">
                        <span className="opacity-75 bg-lightestPurple flex items-center rounded-md border-2 border-mediumPurple dark:bg-darkPurple dark:text-lightestPurple font-semibold mt-2 min-h-12 p-3 w-fit justify-center">{pendingEmail}</span>
                    </div>
                </>
            )}

            <label className="dark:text-lightestPurple font-semibold">Password</label>
            <div className="flex items-center text-darkestPurple w-full">
                <div className="flex w-full justify-between items-center">
                    <span className="flex items-center justify-center rounded-md border-2 border-mediumPurple dark:bg-darkPurple dark:text-lightestPurple font-semibold mt-2 min-h-12 p-3 w-fit bg-white">{password}</span>
                    <button onClick={() => {
                        setStatusMessage("")
                        setShowEditPassword(true)
                    }} className="mt-2 flex dark:border-mediumPurple items-center justify-center dark:text-lightestPurple border-2 rounded-full p-1 sm:p-3 dark:bg-darkPurple dark:hover:bg-lightestPurple dark:hover:text-darkestPurple h-fit bg-darkestPurple border-transparent hover:bg-darkPurple text-lightestPurple"><MdOutlineEdit className="text-xl" /></button>
                </div>
                {showEditPassword && (
                    <OverlayWindow
                        onClose={() => setShowEditPassword(false)}
                        headerText="Change Password"
                        className=" dark:bg-darkestPurple w-full xs:w-3/4 sm:w-1/2 md:w-1/3 lg-w-1/4"
                        className2=" p-4 items-center dark:bg-darkestPurple space-y-4 flex justify-center items-center w-full"
                    >
                        {statusMessage === 'Password successfully changed!' ? (
                            <span className="dark:text-lightestPurple font-semibold">{statusMessage}</span>
                        ) : (
                            <>
                                <form className="relative w-fit" onSubmit={handleUpdatePassword}>
                                    <CustomPasswordInput
                                        name="password 1"
                                        value={oldPassword}
                                        onChange={(e) => setOldPassword(e.target.value)}
                                        placeholder="Current password"
                                        required={true}
                                    />
                                    <CustomPasswordInput
                                        name="password 2"
                                        value={newPassword}
                                        onChange={(e) => setNewPassword(e.target.value)}
                                        placeholder="New password"
                                        required={true}
                                    />
                                       <CustomPasswordInput
                                        name="password 3"
                                        value={newPasswordRepeat}
                                        onChange={(e) => setNewPasswordRepeat(e.target.value)}
                                        placeholder="Repeat new password"
                                        required={true}
                                    />
                                    {passwordErrorMessage && <p className="absolute text-red-800 font-semibold text-center w-full">{passwordErrorMessage}</p>}
                                    <div className="flex space-x-4 mt-6 justify-center">
                                        <Button disabled={loadingPasswordUpdate} width="w-24" onClick={() => setShowEditPassword(false)} type="button">Cancel</Button>
                                        <Button width="w-24" disabled={loadingPasswordUpdate} type="submit">{loadingPasswordUpdate ? <Loading size="w-6 h-6" /> : "Save"} </Button>
                                    </div>
                                </form>
                            </>
                        )}
                    </OverlayWindow>
                )}

            </div>
        </div>
    )
}