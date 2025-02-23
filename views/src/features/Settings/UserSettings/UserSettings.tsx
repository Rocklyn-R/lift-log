import { useState } from "react";
import { FaCheck, FaX } from "react-icons/fa6";
import { MdOutlineEdit } from "react-icons/md";
import { useSelector } from "react-redux";
import { selectEmail } from "../../../redux-store/UserSlice";
import { IoEye, IoEyeOff } from "react-icons/io5";
import { updateUserPassword } from "../../../api/settings";
import { CustomPasswordInput } from "../../../components/CustomPasswordInput";
import { CustomTextInput } from "../../../components/CustomTextInput";
import { OverlayWindow } from "../../../components/OverlayWIndow";
import { Button } from "../../../components/Button";

export const UserSettings = () => {
    const email = useSelector(selectEmail)
    const [username, setUsername] = useState(email);
    const [password, setPassword] = useState('••••••••••••');
    const [showUsername, setShowUserName] = useState(false);
    const [showEditPassword, setShowEditPassword] = useState(false);
    const [newPassword, setNewPassword] = useState("");
    const [oldPassword, setOldPassword] = useState("");
    const [showOldPassword, setShowOldPassword] = useState(false);
    const [showNewPassword, setShowNewPassword] = useState(false);
    const [passwordErrorMessage, setPasswordErrorMessage] = useState("");
    const [statusMessage, setStatusMessage] = useState("");

    const handleUpdatePassword = async () => {
        //event.preventDefault();
        const passwordUpdated = await updateUserPassword(oldPassword, newPassword);
        setOldPassword('');
        setNewPassword('');
        if (passwordUpdated === 'Success') {
            setShowEditPassword(false);
            setStatusMessage('Password successfully changed!');
        } else if (passwordUpdated === 'Old password incorrect') {
            setPasswordErrorMessage('Current password incorrect!');
        } else {
            setStatusMessage('An error ocurred');
        }
    }

    return (
        <div>
            <h2 className="text-lg font-bold mb-2 dark:text-lightestPurple">User Settings</h2>
            <label className="text-lightestPurple font-semibold">E-mail</label>
            <div className="flex items-center justify-between text-darkestPurple w-full">

                <div className="flex w-full justify-between items-center">
                    <span className="flex items-center rounded-md border-2 dark:border-mediumPurple dark:bg-darkPurple dark:text-lightestPurple font-semibold mt-2 min-h-12 p-3 w-fit bg-white justify-center">{username}</span>
                    <button onClick={() => setShowUserName(true)} className="mt-2 flex items-center justify-center dark:text-lightestPurple border-2 rounded-full p-1 sm:p-3 h-fit dark:bg-darkPurple dark:hover:bg-lightestPurple dark:hover:text-darkestPurple"><MdOutlineEdit className="text-xl" /></button>
                </div>

                {showUsername && (
                    <OverlayWindow
                        onClose={() => setShowUserName(false)}
                        headerText="Change Email"
                        className="dark:bg-darkestPurple w-full xs:w-3/4 sm:w-1/2 md:w-1/3 lg-w-1/4"
                        className2="p-4 items-center dark:bg-darkestPurple space-y-4 flex justify-center items-center w-full"
                    >
                        <span className="dark:text-lightestPurple font-semibold">Please enter your new email address.</span>
                        <span className="dark:text-lightestPurple font-semibold">A confirmation email will be sent.</span>
                        <CustomTextInput
                            name="username"
                            value={username}
                            onChange={setUsername}
                            placeholder="Enter your username"
                            className="w-fit "
                        />
                        <div className="flex space-x-4">
                            <Button onClick={() => setShowUserName(false)} type="button">Cancel</Button>
                            <Button type="button">Save</Button>
                        </div>
                    </OverlayWindow>
                )}
            </div>
            <label className="text-lightestPurple font-semibold">Password</label>
            <div className="flex items-center text-darkestPurple w-full">
                <div className="flex w-full justify-between items-center">
                    <span className="flex items-center justify-center rounded-md border-2 dark:border-mediumPurple dark:bg-darkPurple dark:text-lightestPurple font-semibold mt-2 min-h-12 p-3 w-fit bg-white">{password}</span>
                    <button onClick={() => setShowEditPassword(true)} className="mt-2 flex items-center justify-center dark:text-lightestPurple border-2 rounded-full p-1 sm:p-3 dark:bg-darkPurple dark:hover:bg-lightestPurple dark:hover:text-darkestPurple h-fit"><MdOutlineEdit className="text-xl" /></button>
                </div>
                {showEditPassword && (
                    <OverlayWindow
                        onClose={() => setShowEditPassword(false)}
                        headerText="Change Password"
                        className=" dark:bg-darkestPurple w-full xs:w-3/4 sm:w-1/2 md:w-1/3 lg-w-1/4"
                        className2="p-4 items-center dark:bg-darkestPurple space-y-4 flex justify-center items-center w-full"
                    >
                        <CustomPasswordInput
                            name="password 1"
                            value={oldPassword}
                            onChange={(e) => setOldPassword(e.target.value)}
                            placeholder="Current password"
                        />
                        <CustomPasswordInput
                            name="password 2"
                            value={newPassword}
                            onChange={(e) => setNewPassword(e.target.value)}
                            placeholder="New password"
                        />

                        <div className="flex space-x-4">
                            <Button onClick={() => setShowEditPassword(false)} type="button">Cancel</Button>
                            <Button type="button">Save</Button>
                        </div>
                    </OverlayWindow>
                )}

            </div>
        </div>
    )
}