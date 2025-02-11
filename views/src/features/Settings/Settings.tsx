import { Header } from "../../components/Header"
import React, { useEffect, useState } from 'react';
import { MdOutlineEdit } from "react-icons/md";
import { CustomSelect } from "../../components/CustomSelect";
import { FaCheck } from "react-icons/fa6";
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
            <div className="w-full flex justify-center h-full items-center">
                <div className="bg-white md:w-1/2 p-6 shadow-md rounded-lg h-fit">
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
                                        onChange={(system) => setUnitSystemValue(system)}
                                        value={unitSystemValue}
                                        className="w-full"
                                    />
                                    <button onClick={handleChangeUnitSystem} className="mt-2 flex items-center justify-center"><FaCheck className="text-xl" /></button>
                                </>
                            ) : (
                                <>
                                    <span className="mt-2 min-h-12 p-3 w-full bg-white">{unitSystemValue}</span>
                                    <button onClick={() => setShowUnitSystem(true)} className="mt-2 flex items-center justify-center"><MdOutlineEdit className="text-xl" /></button>
                                </>
                            )}

                        </div>
                    </div>

                    {/* User Settings */}
                    <div className="mb-6">
                        
                        <UserSettings />
                    </div>

           
                </div>
            </div>

        </div>
    );
};