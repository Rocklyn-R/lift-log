import { useEffect, useState } from "react";
import { MdArrowBackIos, MdArrowForwardIos } from "react-icons/md";
import { useDispatch } from "react-redux";
import { getAllDates } from "../../../api/logs";
import { Loading } from "../../../components/Loading";
import { OverlayWindow } from "../../../components/OverlayWIndow";
import { setDateToView } from "../../../redux-store/LogsSlice";
import { getDaysInMonth, getYearMonth } from "../../../utilities/utilities";

interface CalendarProps {
    setShowCalendar: (arg0: boolean) => void;
    action: "copy" | "navigate";
    setShowDay: (arg0: boolean) => void;
}


export const Calendar: React.FC<CalendarProps> = ({ setShowCalendar, action, setShowDay }) => {
    const [currentDate, setCurrentDate] = useState(new Date());
    const [highlightedDates, setHighlightedDates] = useState<string[]>([]);
    const dispatch = useDispatch();
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        setLoading(true);
        const monthString = getYearMonth(currentDate)
        const fetchDates = async () => {
            const datesResult = await getAllDates(monthString);
            if (datesResult) {
                const dateStrings = datesResult.map((item: any) => item.date);
                setHighlightedDates(dateStrings);
                setLoading(false);
            }
        }
        fetchDates();
    }, [currentDate]);

    const handleNextMonth = () => {
        setCurrentDate((prev) => new Date(prev.setMonth(prev.getMonth() + 1)));
    };

    const handlePrevMonth = () => {
        setCurrentDate((prev) => new Date(prev.setMonth(prev.getMonth() - 1)));
    };

    const { totalDays, firstDayOfMonth } = getDaysInMonth(currentDate.getFullYear(), currentDate.getMonth() + 1);

    const days: string[] = [];
    for (let i = 1; i <= totalDays; i++) {
        const dayString = `${currentDate.getFullYear()}-${String(currentDate.getMonth() + 1).padStart(2, "0")}-${String(i).padStart(2, "0")}`;
        days.push(dayString);
    }

    const handleSelectDateToView = (date: string) => {
        setShowDay(true);
        setShowCalendar(false);
        dispatch(setDateToView(date));
    };

    return (
        <OverlayWindow
            headerText="Calendar"
            onClose={() => setShowCalendar(false)}
            className2=""
            className="phones:w-full xs:w-4/5 sm:w-3/5 md:w-1/2 lg:w-2/5 xl:w-1/3 2xl:w-1/4">

            <div className="flex justify-between items-center my-4 text-darkestPurple">
                <button
                    onClick={handlePrevMonth}
                    className="px-4 py-2 text-xl"
                >
                    <MdArrowBackIos />
                </button>
                <h3 className="text-xl font-semibold">
                    {currentDate.toLocaleString("default", { month: "long" })} {currentDate.getFullYear()}
                </h3>
                <button
                    onClick={handleNextMonth}
                    className="px-4 py-2 text-xl"
                >
                    <MdArrowForwardIos />
                </button>
            </div>
            <div className="w-full min-h-[300px] h-auto sm:min-h-[350px] flex flex-col">
                 {loading ? <div className="flex flex-grow justify-center items-center pb-6"><Loading /></div> : (
            <div className="grid grid-cols-7 gap-2 text-center px-4 text-darkestPurple place-items-center">
                {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day, idx) => (
                    <div key={idx} className="font-semibold">{day}</div>
                ))}

                {Array(42)
                    .fill(null)
                    .map((_, index) => {
                        const dayIndex = index - firstDayOfMonth + 1;
                        const dayString = `${currentDate.getFullYear()}-${String(currentDate.getMonth() + 1).padStart(2, "0")}-${String(dayIndex).padStart(2, "0")}`;

                        return (
                            <button
                                onClick={() => {
                                    if (dayIndex > 0 && dayIndex <= totalDays) {
                                        handleSelectDateToView(dayString);
                                    }
                                }}
                                key={index}
                                className={`flex justify-center items-center w-9 h-9 sm:w-10 sm:h-10 ${dayIndex > 0 && dayIndex <= totalDays ? "cursor-pointer" : "text-transparent"
                                    } p-2 rounded-full transition ${highlightedDates.includes(dayString) ? "border-2 rounded-full border-darkestPurple" : ""
                                    }`}
                            >
                                {dayIndex > 0 && dayIndex <= totalDays ? dayIndex : ""}
                            </button>
                        );
                    })}
            </div>
            )}
            </div>
           
        </OverlayWindow>
    );
};
