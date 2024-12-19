import { useSelector } from "react-redux"
import { selectSelectedDate, setSelectedDate } from "../../redux-store/LogsSlice";
import { MdArrowBackIos } from "react-icons/md";
import { MdArrowForwardIos } from "react-icons/md";
import { adjustDate, formatDate } from "../../utilities/utilities";
import { useDispatch } from "react-redux";
import { FaPlus } from "react-icons/fa6";
import { useState } from "react";
import { AddLog } from "./AddLog/AddLog";
import { EditLog } from "./EditLog/EditLog";
import { Log } from "./Log/Log";
import { FaCalendarAlt } from "react-icons/fa";
import { Calendar } from "./Calendar/Calendar";
import { IoIosCopy } from "react-icons/io";
import { ShowWorkout } from "./Calendar/ShowWorkout/ShowWorkout";
import { CopyWorkout } from "./Calendar/CopyWorkout/CopyWorkout";


export const LogsPage = () => {
    const selectedDate = useSelector(selectSelectedDate);
    const dispatch = useDispatch();

    const handleAdjustDate = (direction: 'back' | 'forward') => {
        const newDate = adjustDate(direction, selectedDate);
        dispatch(setSelectedDate(newDate));
    }

    const [showAddExercise, setShowAddExercise] = useState(false);
    const [showEditExercise, setShowEditExercise] = useState(false);
    const [showCalendarNav, setShowCalendarNav] = useState(false);
    const [showCalendarCopy, setShowCalendarCopy] = useState(false);
    const [showViewDay, setShowViewDay] = useState(false);
    const [showCopyDay, setShowCopyDay] = useState(false);

    return (
        <div className="w-full relative flex justify-center min-h-screen">
            <div className="w-full flex flex-col items-center min-h-screen">
                <div className="sticky top-0 w-full py-5 px-52 bg-darkestPurple flex justify-between items-center">
                    <button
                        onClick={() => handleAdjustDate('back')}
                        className="text-lightestPurple text-2xl"
                    >
                        <MdArrowBackIos />
                    </button>

                    <h1 className="text-lightestPurple text-xl font-semibold flex-grow text-center">
                        {formatDate(selectedDate)}
                    </h1>

                    <button
                        onClick={() => handleAdjustDate('forward')}
                        className="text-lightestPurple text-2xl"
                    >
                        <MdArrowForwardIos />
                    </button>
                </div>

                <div className="flex flex-col w-1/3 space-y-4 mt-4">

                    <Log
                        setShowEditExercise={setShowEditExercise}
                    />

                    <div>
                        <button
                            onClick={() => setShowCalendarNav(true)}
                            className="bg-darkestPurple p-3 fixed top-2 right-14 rounded-full justify-self-end text-lightestPurple text-2xl hover:bg-darkPurple"
                        >
                            <FaCalendarAlt />
                        </button>
                    </div>
                </div>
                <button
                    onClick={() => setShowAddExercise(true)}
                    className="bg-darkestPurple p-3 fixed bottom-14 right-14 rounded-full justify-self-end text-lightestPurple text-2xl hover:bg-darkPurple">
                    <FaPlus />
                </button>
                <button
                    onClick={() => setShowCalendarCopy(true)}
                    className="bg-darkestPurple p-3 fixed bottom-1/6 right-14 rounded-full justify-self-end text-lightestPurple text-2xl hover:bg-darkPurple">
                    <IoIosCopy />
                </button>

            </div>
            {showCalendarCopy && (
                <Calendar
                    action="copy"
                    setShowCalendar={setShowCalendarCopy}
                    setShowDay={setShowCopyDay}
                />
            )}
            {showCalendarNav && (
                <Calendar
                    action="navigate"
                    setShowCalendar={setShowCalendarNav}
                    setShowDay={setShowViewDay}
                />
            )}
            {showAddExercise && (
                <AddLog
                    setShowAddExercise={setShowAddExercise}
                />
            )}

            {showEditExercise && (
                <EditLog
                    setShowEditExercise={setShowEditExercise}
                />
            )}
            {showViewDay && (
                <ShowWorkout 
                    setShowViewDay={setShowViewDay}
                    setShowCalendar={setShowCalendarNav}
                />
            )}
            {showCopyDay && (
                <CopyWorkout 
                    setShowCalendar={setShowCalendarCopy}
                    setShowCopyDay={setShowCopyDay}
                    //setShowCopyMessage={setShowCopyMessage}
                />
            )}
          
        </div>
    )
}