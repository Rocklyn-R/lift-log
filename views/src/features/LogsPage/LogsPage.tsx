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
import { setSelectedCategory, setSelectedSet, setSelectedExercise, setExerciseHistory } from "../../redux-store/LogsSlice";
import { setExercises } from "../../redux-store/LibrarySlice";


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
    const specialCases = ["Today", "Yesterday", "Tomorrow"];
    const formattedDate = formatDate(selectedDate);
    const dateStringIsDate = !specialCases.includes(formattedDate);


    const splitFormattedDate = (formattedDate: string) => {

        if (specialCases.includes(formattedDate)) {
            return {
                day: formattedDate,
                date: "", // No second line needed
            };
        }

        const [day, ...rest] = formattedDate.split(", ");
        return {
            day: day + ",",
            date: rest.join(", "), // e.g., "May 3" or "May 3, 2025"
        };
    }



    const { day, date } = splitFormattedDate(formatDate(selectedDate));

    const closeAddExercise = () => {
        setShowAddExercise(false);
        dispatch(setExercises([]));
        dispatch(setSelectedCategory(""));
        dispatch(setSelectedExercise(null));
        dispatch(setSelectedSet(null));
        dispatch(setExerciseHistory([]));
    }






    return (
        <div className="w-full h-full xl:pl-0 pl-16 relative flex justify-center min-h-screen pb-4">
            <div className="w-full h-full flex flex-col items-center min-h-screen">
                <div className="sticky top-0 w-full  bg-darkestPurple flex justify-center z-40">
                    <button
                        onClick={() => handleAdjustDate('back')}
                        className={` ${dateStringIsDate ? "top-6 sm:top-3" : "top-3"} z-50  md:left-1/4 sm:left-1/5 left-1/6 p-3 flex justify-center absolute text-lightestPurple text-2xl`}
                    >
                        <FaAngleLeft />
                    </button>
                    <Header
                        text={
                            <>
                                <span className="hidden sm:inline">{formatDate(selectedDate)}</span>
                                <span className="block sm:hidden">
                                    {day}
                                    {date && <><br />{date}</>}
                                </span>
                            </>
                        }
                    />


                    <button
                        onClick={() => handleAdjustDate('forward')}
                        className={`${dateStringIsDate ? "top-6 sm:top-3" : "top-3"} md:right-1/4 sm:right-1/5 right-1/6 z-50 absolute p-3 text-lightestPurple text-2xl`}
                    >
                        <FaAngleRight />
                    </button>

                    <button
                        onClick={() => setShowCalendarNav(true)}
                        className={`z-50 ${dateStringIsDate ? 'top-5 sm:top-2' : 'top-2'} dark:sm:hover:bg-lightestPurple dark:sm:hover:text-darkestPurple dark:sm:border-mediumPurple dark:sm:bg-darkPurple  border-2 border-transparent bg-darkestPurple p-3 fixed right-0 xs:right-6 md:right-8 xl:right-14 rounded-full justify-self-end text-lightestPurple text-2xl hover:bg-darkPurple`}
                    >
                        <FaCalendarAlt />
                    </button>

                </div>
                <div className={`flex h-fit flex-col items-center w-full mt-4 mb-4 pb-4 phones-sm:pb-24`}>
                    {isLoading ? (
                        <div className="dark:bg-darkestPurple flex flex-col items-center mt-20 h-screen bg-lightestPurple">
                            <Loading />
                        </div>
                    ) : (
                        <>
                            <Log
                                setShowEditExercise={setShowEditExercise}
                            />
                        </>
                    )}


                </div>
                <div className="z-40 phones-sm:fixed phones-sm:flex hidden justify-center items-center bottom-0 left-0 w-full h-[10%] pl-16 space-x-4 dark:bg-darkestPurple bg-lightestPurple border-t-2 border-mediumPurple">
                    <button
                        onClick={() => setShowAddExercise(true)}
                        className="z-40 dark:border-mediumPurple dark:bg-darkPurple dark:hover:bg-lightestPurple dark:hover:text-darkestPurple border-2 border-transparent bg-darkestPurple p-3 rounded-full text-lightestPurple text-2xl hover:bg-darkPurple">
                        <FaPlus />
                    </button>
                    <button
                        onClick={() => setShowCalendarCopy(true)}
                        className="z-40 dark:border-mediumPurple dark:bg-darkPurple dark:hover:bg-lightestPurple dark:hover:text-darkestPurple border-2 border-transparent bg-darkestPurple p-3 flex justify-center items-center rounded-full text-lightestPurple text-2xl hover:bg-darkPurple">
                        <IoIosCopy />
                    </button>

                </div>
                <button
                    onClick={() => setShowAddExercise(true)}
                    className="z-40 phones-sm:hidden dark:border-mediumPurple dark:bg-darkPurple dark:hover:bg-lightestPurple dark:hover:text-darkestPurple border-2 border-transparent bg-darkestPurple p-3 fixed bottom-12 right-6 sm:right-10 rounded-full justify-self-end text-lightestPurple text-2xl hover:bg-darkPurple">
                    <FaPlus />
                </button>
                <button
                    onClick={() => setShowCalendarCopy(true)}
                    className="z-40 phones-sm:hidden dark:border-mediumPurple dark:bg-darkPurple dark:hover:bg-lightestPurple dark:hover:text-darkestPurple border-2 border-transparent bg-darkestPurple p-3 fixed bottom-1/5 h-md:bottom-1/6 right-6 sm:right-10  rounded-full justify-self-end text-lightestPurple text-2xl hover:bg-darkPurple">
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
                    closeAddExercise={closeAddExercise}
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