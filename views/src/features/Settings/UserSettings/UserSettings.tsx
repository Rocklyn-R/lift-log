import { useState } from "react";
import { FaCheck, FaX } from "react-icons/fa6";
import { MdOutlineEdit } from "react-icons/md";
import { useSelector } from "react-redux";
import { selectEmail } from "../../../redux-store/UserSlice";
import { IoEye, IoEyeOff } from "react-icons/io5";
import { updateUserPassword } from "../../../api/settings";

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
            <h2 className="text-lg font-bold mb-2">User Settings</h2>
            <div className="flex text-darkestPurple space-x-4 w-48">
                {showUsername ? (
                    <>
                        <input
                            type="text"
                            className=" mt-2 p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-darkPurple"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            placeholder="Enter your username"
                        />
                        <button onClick={() => setShowUserName(false)} className="mt-2 flex items-center justify-center"><FaCheck className="text-xl" /></button>
                        <button onClick={() => setShowUserName(false)} className="mt-2 flex items-center justify-center"><FaX className="text-lg" /></button>
                    </>
                ) : (
                    <>
                        <span className="mt-2 min-h-12 p-3 w-full bg-white">{username}</span>
                        <button onClick={() => setShowUserName(true)} className="mt-2 flex items-center justify-center"><MdOutlineEdit className="text-xl" /></button>
                    </>
                )}


            </div>
            <div className="flex text-darkestPurple space-x-4 w-fit">
                {showEditPassword ? (
                    <div className="flex space-x-4 w-full">
                        <div className="relative">
                            <input
                                 type={showOldPassword ? 'text' : 'password'}
                                className="mt-2 p-3 z-40 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-darkPurple"
                                value={oldPassword}
                                onChange={(e) => setOldPassword(e.target.value)}
                                placeholder="Current password"
                            />
                            <button
                                type="button"
                                onClick={() => setShowOldPassword(!showOldPassword)}
                                className="absolute z-50 right-3 top-6"
                            >
                                {showOldPassword ? <IoEye className="text-xl text-gray-400" /> : <IoEyeOff className="text-xl text-gray-400" />}
                            </button>
                        </div>
                        <div className="relative">
                            <input
                                type={showNewPassword ? 'text' : 'password'}
                                className="mt-2 p-3 border z-40 border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-darkPurple"
                                value={newPassword}
                                onChange={(e) => setNewPassword(e.target.value)}
                                placeholder="New password"
                            />
                           
                            <button
                                type="button"
                                onClick={() => setShowNewPassword(!showNewPassword)}
                                className="absolute z-50 right-3 top-6"
                            >
                                {showNewPassword ? <IoEye className="text-xl text-gray-400" /> : <IoEyeOff className="text-xl text-gray-400" />}
                            </button>
                        </div>
                        <button onClick={handleUpdatePassword} className="mt-2 flex items-center justify-center"><FaCheck className="text-xl" /></button>
                        <button onClick={() => setShowEditPassword(false)} className="mt-2 flex items-center justify-center"><FaX className="text-lg" /></button>
                    </div>
                ) : (
                    <>
                        <span className="mt-2 min-h-12 p-3 w-full bg-white">{password}</span>
                        <button onClick={() => setShowEditPassword(true)} className="mt-2 flex items-center justify-center"><MdOutlineEdit className="text-xl" /></button>
                       
                    </>
                )}

            </div>
        </div>
    )
}