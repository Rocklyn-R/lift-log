import { Header } from "../../components/Header"
import React, { useState } from 'react';
import { MdOutlineEdit } from "react-icons/md";
import { CustomSelect } from "../../components/CustomSelect";
import { FaCheck } from "react-icons/fa6";



export const Settings = () => {
    const [theme, setTheme] = useState('Light'); // Default theme is Light
    const [showTheme, setShowTheme] = useState(false);
    const [unitSystem, setUnitSystem] = useState('Metric');
    const [showUnitSystem, setShowUnitSystem] = useState(false);
    const [username, setUsername] = useState(''); // Placeholder for username
    const [password, setPassword] = useState(''); // Placeholder for password

    return (
        <div className="flex flex-col items-center h-full">
            <Header text="Settings" />
            <div className="w-full flex justify-center h-full items-center">
                <div className="bg-white w-1/2 p-6 shadow-md rounded-lg h-fit">
                    {/* Theme Settings */}
                    <div className="mb-6 flex flex-col items-start w-full">

                        <h2 className="text-lg font-bold">Theme</h2>



                        <div className="flex text-darkestPurple w-32 space-x-4">
                            {showTheme ? (
                                <>
                                    <CustomSelect
                                        options={[{ id: 1, name: "Light" }, { id: 2, name: "Dark" }]}
                                        onChange={(theme) => setTheme(theme)}
                                        value={theme}
                                        className="w-full"
                                    />
                                    <button onClick={() => setShowTheme(false)} className="mt-2 flex items-center justify-center"><FaCheck className="text-xl" /></button>
                                </>
                            ) : (
                                <>
                                    <span className="mt-2 min-h-12 p-3 w-full bg-white">{theme}</span>
                                    <button onClick={() => setShowTheme(true)} className="mt-2 flex items-center justify-center"><MdOutlineEdit className="text-xl" /></button>
                                </>
                            )}

                        </div>

                    </div>

                    {/* Unit System Settings */}
                    <div className="mb-6">
                        <h2 className="text-lg font-bold mb-2">Unit System</h2>
                        <div className="flex text-darkestPurple w-36 space-x-4">
                            {showUnitSystem ? (
                                <>
                                    <CustomSelect
                                        options={[{ id: 1, name: "Metric" }, { id: 2, name: "Imperial" }]}
                                        onChange={(system) => setUnitSystem(system)}
                                        value={unitSystem}
                                        className="w-full"
                                    />
                                    <button onClick={() => setShowUnitSystem(false)} className="mt-2 flex items-center justify-center"><FaCheck className="text-xl" /></button>
                                </>
                            ) : (
                                <>
                                    <span className="mt-2 min-h-12 p-3 w-full bg-white">{unitSystem}</span>
                                    <button onClick={() => setShowUnitSystem(true)} className="mt-2 flex items-center justify-center"><MdOutlineEdit className="text-xl" /></button>
                                </>
                            )}

                        </div>
                    </div>

                    {/* User Settings */}
                    <div className="mb-6">
                        <h2 className="text-lg font-bold mb-2">User Settings</h2>
                        <div className="mb-4">
                            <label className="block mb-1 font-medium">Username</label>
                            <input
                                type="text"
                                className="border border-gray-300 rounded p-2 w-full"
                                value={username}
                                onChange={(e) => setUsername(e.target.value)}
                                placeholder="Enter your username"
                            />
                        </div>
                        <div>
                            <label className="block mb-1 font-medium">Password</label>
                            <input
                                type="password"
                                className="border border-gray-300 rounded p-2 w-full"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                placeholder="Enter your password"
                            />
                        </div>
                    </div>

                    <button
                        className="bg-blue-500 text-white p-2 rounded hover:bg-blue-600"
                        onClick={() => {
                            alert(`Settings Updated:\nTheme: ${theme}\nUnit System: ${unitSystem}\nUsername: ${username}`);
                        }}
                    >
                        Save Settings
                    </button>
                </div>
            </div>

        </div>
    );
};