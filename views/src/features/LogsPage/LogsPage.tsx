import { useSelector } from "react-redux"
import { selectLogsLoading, selectSelectedDate, setSelectedDate } from "../../redux-store/LogsSlice";
import { adjustDate, formatDate } from "../../utilities/utilities";
import { useDispatch } from "react-redux";
import { FaAngleLeft, FaAngleRight, FaPlus } from "react-icons/fa6";
import { useState } from "react";
import { AddLog } from "./AddLog/AddLog";
import { EditLog } from "./EditLog/EditLog";
import { Log } from "./Log/Log";
import { FaCalendarAlt } from "react-icons/fa";
import { Calendar } from "./Calendar/Calendar";
import { IoIosCopy } from "react-icons/io";
import { ShowWorkout } from "./Calendar/ShowWorkout/ShowWorkout";
import { CopyWorkout } from "./Calendar/CopyWorkout/CopyWorkout";
import { Header } from "../../components/Header";
import { Loading } from "../../components/Loading";


export const LogsPage = () => {
    const selectedDate = useSelector(selectSelectedDate);
    const dispatch = useDispatch();
    const isLoading = useSelector(selectLogsLoading);

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
    const dateStringLong = formatDate(selectedDate).length > 10;

    return (
        <div className="w-full xl:pl-0 pl-16 relative flex justify-center min-h-screen">
            <div className="w-full flex flex-col items-center min-h-screen">
                <div className=" sticky top-0 w-full  bg-darkestPurple flex justify-center ">
                    <button
                        onClick={() => handleAdjustDate('back')}
                        className={` ${dateStringLong ? "xs:top-5 top-5" : "top-2"} p-3 flex justify-center absolute left-12 xs:left-24 sm:left-44 md:left-52 lg:left-72 md:top-3 text-lightestPurple text-2xl`}
                    >
                        <FaAngleLeft />
                    </button>

                    <Header text={formatDate(selectedDate)} />



                    <button
                        onClick={() => handleAdjustDate('forward')}
                        className={`${dateStringLong ? "xs:top-5 top-5" : "top-2"} absolute p-3 right-12 xs:right-24 sm:right-44 md:right-52 lg:right-72 md:top-3 text-lightestPurple text-2xl`}
                    >
                        <FaAngleRight />
                    </button>
                </div>
                <div className={`flex flex-col items-center w-full space-y-4 mt-4`}>
                    {isLoading ? (
                        <div className="dark:bg-darkestPurple flex flex-col items-center justify-center h-screen bg-lightestPurple">
                            <Loading />
                        </div>
                    ) : (
                        <>

                            <Log
                                setShowEditExercise={setShowEditExercise}
                            />
                        </>
                    )}



                    <div>
                        <button
                            onClick={() => setShowCalendarNav(true)}
                            className={`${dateStringLong ? 'xs:top-5 sm:top-5 md:top-2 top-5' : 'top-2'} dark:sm:hover:bg-lightestPurple dark:sm:hover:text-darkestPurple dark:sm:border-lightestPurple dark:sm:bg-darkPurple  border-2 border-transparent bg-darkestPurple p-3 fixed right-0 xs:right-6 md:right-8 xl:right-14 rounded-full justify-self-end text-lightestPurple text-2xl hover:bg-darkPurple`}
                        >
                            <FaCalendarAlt />
                        </button>
                    </div>
                </div>
                <button
                    onClick={() => setShowAddExercise(true)}
                    className="dark:border-lightestPurple dark:bg-darkPurple dark:hover:bg-lightestPurple dark:hover:text-darkestPurple border-2 border-transparent bg-darkestPurple p-3 fixed bottom-12 right-6 sm:right-10 rounded-full justify-self-end text-lightestPurple text-2xl hover:bg-darkPurple">
                    <FaPlus />
                </button>
                <button
                    onClick={() => setShowCalendarCopy(true)}
                    className="dark:border-lightestPurple dark:bg-darkPurple dark:hover:bg-lightestPurple dark:hover:text-darkestPurple border-2 border-transparent bg-darkestPurple p-3 fixed bottom-1/5 h-md:bottom-1/6 right-6 sm:right-10  rounded-full justify-self-end text-lightestPurple text-2xl hover:bg-darkPurple">
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