import { useSelector } from "react-redux"
import { selectSelectedDate, setSelectedDate } from "../../../redux-store/LogsSlice";
import { MdArrowBackIos } from "react-icons/md";
import { MdArrowForwardIos } from "react-icons/md";
import { adjustDate, formatDate } from "../../../utilities/utilities";
import { useDispatch } from "react-redux";
import { FaPlus } from "react-icons/fa6";


export const LogsPage = () => {
    const selectedDate = useSelector(selectSelectedDate);
    const dispatch = useDispatch();

    const handleAdjustDate = (direction: 'back' | 'forward') => {
        const newDate = adjustDate(direction, selectedDate);
        dispatch(setSelectedDate(newDate));
    }

    return (
        <div className="w-full flex justify-center">
            <div className="w-full flex flex-col items-center justify-between h-screen">
                <div className="w-full py-5 px-52 bg-darkestPurple flex justify-between items-center">
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
                <div className="mb-10">
                    <button 
                    
                    className="bg-darkestPurple p-3 rounded-full text-lightestPurple text-2xl hover:bg-darkPurple">
                        <FaPlus />
                    </button>
                </div>

            </div>

        </div>
    )
}