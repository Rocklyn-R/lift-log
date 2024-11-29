import { useSelector } from "react-redux"
import { Wrapper } from "../../../components/Wrapper"
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
        <Wrapper>
            <div className="w-full flex flex-col items-center justify-between h-screen">
                <div className="w-full py-5 px-52 bg-darkestBlue flex justify-between items-center">
                    <button
                        onClick={() => handleAdjustDate('back')}
                        className="text-lightestBlue text-2xl"
                    >
                        <MdArrowBackIos />
                    </button>

                    <h1 className="text-lightestBlue text-xl font-semibold flex-grow text-center">
                        {formatDate(selectedDate)}
                    </h1>

                    <button
                        onClick={() => handleAdjustDate('forward')}
                        className="text-lightestBlue text-2xl"
                    >
                        <MdArrowForwardIos />
                    </button>
                </div>
                <div className="mb-10">
                    <button className="bg-darkestBlue p-3 rounded-full text-lightestBlue text-2xl hover:bg-darkBlue">
                        <FaPlus />
                    </button>
                </div>

            </div>

        </Wrapper>
    )
}