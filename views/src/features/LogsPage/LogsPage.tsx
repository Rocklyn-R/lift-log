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
    const dateStringLong = formatDate(selectedDate).length > 8;

    return (
        <div className="w-full xl:pl-0 pl-16 relative flex justify-center min-h-screen">
            <div className="w-full flex flex-col items-center min-h-screen">
                <div className="sticky top-0 w-full py-5 bg-darkestPurple flex justify-center ">
                    <button
                        onClick={() => handleAdjustDate('back')}
                        className={`${dateStringLong ? "top-8" : "top-5"} absolute xs:top-5 left-20 xs:left-24 sm:left-44 md:left-52 lg:left-72 md:top-6 text-lightestPurple text-2xl`}
                    >
                        <MdArrowBackIos />
                    </button>

                    <h1 className="text-lightestPurple xs:w-fit w-28 md:text-xl font-semibold text-center">
                        {formatDate(selectedDate)}
                    </h1>

                    <button
                        onClick={() => handleAdjustDate('forward')}
                        className={`${dateStringLong ? "top-8" : "top-5"} absolute xs:top-5 right-20 xs:right-24 sm:right-44 md:right-52 lg:right-72 md:top-6 text-lightestPurple text-2xl`}
                    >
                        <MdArrowForwardIos />
                    </button>
                </div>

                <div className="flex flex-col items-center w-full space-y-4 mt-4">

                    <Log
                        setShowEditExercise={setShowEditExercise}
                    />

                    <div>
                        <button
                            onClick={() => setShowCalendarNav(true)}
                            className={`${dateStringLong ? 'top-5' : 'top-2'} bg-darkestPurple p-3 fixed xs:top-2 right-0 xs:right-6 md:right-8 xl:right-14 rounded-full justify-self-end text-lightestPurple text-2xl hover:bg-darkPurple`}
                        >
                            <FaCalendarAlt />
                        </button>
                    </div>
                </div>
                <button
                    onClick={() => setShowAddExercise(true)}
                    className="bg-darkestPurple p-3 fixed bottom-14 right-6 sm:right-10 rounded-full justify-self-end text-lightestPurple text-2xl hover:bg-darkPurple">
                    <FaPlus />
                </button>
                <button
                    onClick={() => setShowCalendarCopy(true)}
                    className="bg-darkestPurple p-3 fixed bottom-1/5 h-md:bottom-1/6 right-6 sm:right-10  rounded-full justify-self-end text-lightestPurple text-2xl hover:bg-darkPurple">
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