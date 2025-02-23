import { Header } from "../../components/Header"
import React, { useEffect, useState } from 'react';
import { MdOutlineEdit } from "react-icons/md";
import { CustomSelect } from "../../components/CustomSelect";
import { FaCheck, FaX } from "react-icons/fa6";
import { updateUnitSystem } from "../../api/settings";
import { useDispatch } from "react-redux";
import { changeUnitSystem, selectSettingsLoading, selectUnitSystem } from "../../redux-store/SettingsSlice";
import { useSelector } from "react-redux";
import { Loading } from "../../components/Loading";
import { UserSettings } from "./UserSettings/UserSettings";


export const Settings = () => {
    const [theme, setTheme] = useState('Light'); // Default theme is Light
    const [showTheme, setShowTheme] = useState(false);
    const unitSystem = useSelector(selectUnitSystem);
    const [unitSystemValue, setUnitSystemValue] = useState(unitSystem);
    const [showUnitSystem, setShowUnitSystem] = useState(false);
    const dispatch = useDispatch();
    const isLoading = useSelector(selectSettingsLoading);

    const handleChangeUnitSystem = async () => {
        const unitSystemResult = await updateUnitSystem(unitSystemValue);
        if (unitSystemResult) {
            dispatch(changeUnitSystem(unitSystemValue))
        }
        setShowUnitSystem(false);
    }

    useEffect(() => {
        setUnitSystemValue(unitSystem)
    }, [unitSystem]);

    if (isLoading) {
        return (
            <div className="flex flex-col items-center justify-center h-screen bg-lightestPurple">
                <Loading />
            </div>
        );
    }

    return (
        <div className="flex flex-col items-center h-full xl:pl-0 pl-16 ">
            <Header text="Settings" />
            <div className="mt-4 md:text-base text-xs w-full flex justify-center h-full">
                <div className="dark:sm:bg-darkPurple dark:bg-darkestPurple rounded-none sm:rounded-md sm:border-2 border-mediumPurple bg-white lg:w-1/3 md:w-2/3 sm:w-3/4 w-full sm:p-6 shadow-md h-fit">
                    {/* Theme Settings */}
                    <div className="relative dark:bg-darkestPurple mb-6 flex flex-col items-start w-full rounded-none border-y-2 sm:border-2 dark:border-mediumPurple sm:rounded-md p-2 sm:p-4">

                        <h2 className="text-lg font-bold dark:text-lightestPurple">Theme</h2>

                        <div className="flex items-center justify-between text-darkestPurple w-full space-x-4">
                            {showTheme ? (
                                <>
                                    <CustomSelect
                                        options={[{ id: 1, name: "Light" }, { id: 2, name: "Dark" }]}
                                        onChange={(theme) => setTheme(theme)}
                                        value={theme}
                                        className="w-20"
                                    />
                                    <div className="flex space-x-2 items-center">
                                        <button onClick={() => setShowTheme(false)} className="mt-2 flex items-center justify-center dark:text-lightestPurple border-2 rounded-full p-1 sm:p-3 dark:bg-darkPurple dark:hover:bg-lightestPurple dark:hover:text-darkestPurple h-fit"><FaCheck className="text-xl" /></button>
                                        <button onClick={() => setShowTheme(false)} className="mt-2 flex items-center justify-center dark:text-lightestPurple border-2 rounded-full p-1 sm:p-3 dark:bg-darkPurple dark:hover:bg-lightestPurple dark:hover:text-darkestPurple h-fit"><FaX className="text-lg" /></button>
                                    </div>

                                </>
                            ) : (
                                <div className="flex w-full justify-between items-center">
                                    <span className="flex items-center w-fit rounded-md border-2 dark:border-mediumPurple dark:bg-darkPurple dark:text-lightestPurple font-semibold mt-2 min-h-12 p-3 bg-white">{theme}</span>
                                    <button onClick={() => setShowTheme(true)} className="mt-2 flex items-center justify-center dark:text-lightestPurple border-2 rounded-full p-1 sm:p-3 dark:bg-darkPurple dark:hover:bg-lightestPurple dark:hover:text-darkestPurple"><MdOutlineEdit className="text-xl" /></button>
                                </div>
                            )}

                        </div>
                    </div>
                    {/* Unit System Settings */}
                    <div className="mb-6 sm:border-2 border-y-2 dark:border-mediumPurple sm:p-4 p-2 rounded-none sm:rounded-md dark:bg-darkestPurple">
                        <h2 className="text-lg font-bold mb-2 dark:text-lightestPurple">Unit System</h2>
                        <div className="flex items-center w-full justify-between text-darkestPurple space-x-4">
                            {showUnitSystem ? (
                                <>
                                    <CustomSelect
                                        options={[{ id: 1, name: "Metric" }, { id: 2, name: "Imperial" }]}
                                        onChange={(system) => setUnitSystemValue(system)}
                                        value={unitSystemValue}
                                        className="w-[6.2rem]"
                                    />
                                    <div className="flex space-x-2 items-center">
                                        <button onClick={handleChangeUnitSystem} className="mt-2 flex items-center justify-center dark:text-lightestPurple border-2 rounded-full p-1 sm:p-3 dark:bg-darkPurple dark:hover:bg-lightestPurple dark:hover:text-darkestPurple h-fit"><FaCheck className="text-xl" /></button>
                                        <button onClick={() => setShowUnitSystem(false)} className="mt-2 flex items-center justify-center dark:text-lightestPurple border-2 rounded-full p-1 sm:p-3 dark:bg-darkPurple dark:hover:bg-lightestPurple dark:hover:text-darkestPurple h-fit"><FaX className="text-lg" /></button>
                                    </div>

                                </>
                            ) : (
                                <div className="flex w-full justify-between items-center">
                                    <span className="flex items-center justify-center rounded-md border-2 dark:border-mediumPurple dark:bg-darkPurple dark:text-lightestPurple font-semibold mt-2 min-h-12 p-3 bg-white">{unitSystemValue}</span>
                                    <button onClick={() => setShowUnitSystem(true)} className="mt-2 flex items-center justify-center dark:text-lightestPurple p-1 sm:p-3 border-2 rounded-full dark:bg-darkPurple dark:hover:bg-lightestPurple dark:hover:text-darkestPurple"><MdOutlineEdit className="text-xl" /></button>
                                </div>
                            )}

                        </div>
                    </div>

                    {/* User Settings */}
                    <div className="mb-6 sm:border-2 border-y-2 border-mediumPurple p-2 sm:p-4 rounded-none sm:rounded-md dark:bg-darkestPurple">

                        <UserSettings />
                    </div>


                </div>
            </div>

        </div>
    );
};