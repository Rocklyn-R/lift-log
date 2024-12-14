import { useEffect, useState } from "react";
import { MdArrowBackIos, MdArrowForwardIos } from "react-icons/md";
import { getAllDates } from "../../../api/logs";
import { OverlayWindow } from "../../../components/OverlayWIndow";
import { getDaysInMonth, getYearMonth } from "../../../utilities/utilities";

interface CalendarProps {
    setShowCalendar: (arg0: boolean) => void;
    action: "copy" | "navigate"
}


export const Calendar: React.FC<CalendarProps> = ({ setShowCalendar, action }) => {
    const [currentDate, setCurrentDate] = useState(new Date());
    const [highlightedDates, setHighlightedDates] = useState<string[]>([]);

    useEffect(() => {
        const monthString = getYearMonth(currentDate)
        const fetchDates = async () => {
            const datesResult = await getAllDates(monthString);
            if (datesResult) {
                const dateStrings = datesResult.map((item: any) => item.date);
                setHighlightedDates(dateStrings);
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

    

    return (
        <OverlayWindow
            headerText="Calendar"
            onClose={() => setShowCalendar(false)}
            className2="max-h-[50vh]">
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

            <div className="grid grid-cols-7 gap-2 text-center p-4 text-darkestPurple">
                {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day, idx) => (
                    <div key={idx} className="font-semibold">{day}</div>
                ))}

                {Array(42)
                    .fill(null)
                    .map((_, index) => {
                        const dayIndex = index - firstDayOfMonth + 1;
                        const dayString = `${currentDate.getFullYear()}-${String(currentDate.getMonth() + 1).padStart(2, "0")}-${String(dayIndex).padStart(2, "0")}`;

                        return (
                            <div
                                key={index}
                                className={`flex justify-center items-center w-10 h-10 ${dayIndex > 0 && dayIndex <= totalDays ? "cursor-pointer" : "text-transparent"
                                    } p-2 rounded-full transition ${highlightedDates.includes(dayString) ? "border-2 rounded-full border-darkestPurple" : ""
                                    }`}
                            >
                                {dayIndex > 0 && dayIndex <= totalDays ? dayIndex : ""}
                            </div>
                        );
                    })}
            </div>
        </OverlayWindow>
    );
};