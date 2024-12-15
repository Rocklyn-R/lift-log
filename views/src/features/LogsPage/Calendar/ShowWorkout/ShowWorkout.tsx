import { useDispatch } from "react-redux";
import { useSelector } from "react-redux";
import { OverlayWindow } from "../../../../components/OverlayWIndow"
import { selectDateToView, selectWorkoutOnDate, setDateToView, setSelectedDate, setWorkoutOnDate } from "../../../../redux-store/LogsSlice";
import { formatDateForHistory, formatNumber } from "../../../../utilities/utilities";
import { useEffect } from "react";
import { getLog } from "../../../../api/logs";
import { Workout } from "../../../../types/types";
import { FaTrophy } from "react-icons/fa6";
import { Button } from "../../../../components/Button";
import { MdArrowBackIos } from "react-icons/md";
import { useWorkoutOnDayFetch } from "../../../../hooks/useWorkoutOnDayFetch";

interface ShowWorkoutProps {
    setShowViewDay: (arg0: boolean) => void;
    setShowCalendar: (arg0: boolean) => void;
}

export const ShowWorkout: React.FC<ShowWorkoutProps> = ({ setShowViewDay, setShowCalendar }) => {
    useWorkoutOnDayFetch();
    
    const dispatch = useDispatch();

    const handleCloseShowWorkout = () => {
        setShowViewDay(false);
        dispatch(setDateToView(""));
        dispatch(setWorkoutOnDate([]));
    }

    const dateToView = useSelector(selectDateToView);
    const formattedDate = formatDateForHistory(dateToView);
    const workoutOnDate = useSelector(selectWorkoutOnDate);


    const handleNavigateBack = () => {
        setShowCalendar(true);
       handleCloseShowWorkout();
    }

    const handleGoToDay = () => {
        dispatch(setSelectedDate(dateToView));
        handleCloseShowWorkout();
    }

    return (
        <OverlayWindow
            onClose={() => handleCloseShowWorkout()}
            headerText={formattedDate}
            className="w-1/3 min-h-[55vh] overflow-y-auto relative"
            className2={`${workoutOnDate.length === 0 ? "flex h-[45vh] items-center justify-center" : "flex flex-col justify-between"}`}
        >
               <button
                    onClick={() => handleNavigateBack()}
                    style={{ height: '0' }}
                    className="absolute top-4 left-4 z-50"
                ><MdArrowBackIos className="text-2xl text-lightestPurple"/></button>
            {workoutOnDate.length === 0 && (
                <span>There is no workout saved for this day.</span>
            )}
            {workoutOnDate.map((exercise, index) => (
                <div key={index}>
                    {exercise.sets.length > 0 && (
                        <>
                            <h3 className="p-2 border-b-2 border-lightPurple font-semibold text-lg">{exercise.exercise_name}</h3>
                            <div className="p-3">
                                {exercise.sets.map((set, index) => (
                                    <div key={index} className="p-2 grid grid-cols-3 text-center items-center">
                                        <span>{set.pr && <span className="text-mediumPurple flex justify-end"><FaTrophy /></span>}</span>
                                        <span className="flex justify-end">{formatNumber(set.weight)} kgs</span>
                                        <span className="flex justify-end">{set.reps} reps</span>
                                    </div>
                                ))}
                            </div>
                        </>
                    )}
                </div>
            ))}
            <div className="absolute bottom-4 w-full flex justify-center space-x-4">
                <Button
                type="button"
                onClick={handleCloseShowWorkout}
                
                >
                    Cancel
                </Button>
                <Button
                    type="button"
                    onClick={handleGoToDay}
                >
                    Go To
                </Button>
            </div>
            
        </OverlayWindow>
    )
}