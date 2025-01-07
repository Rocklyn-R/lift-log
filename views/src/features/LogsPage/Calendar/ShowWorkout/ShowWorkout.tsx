import { useDispatch } from "react-redux";
import { useSelector } from "react-redux";
import { OverlayWindow } from "../../../../components/OverlayWIndow"
import { selectDateToView, selectWorkoutOnDate, setDateToView, setSelectedDate, setWorkoutOnDate } from "../../../../redux-store/LogsSlice";
import { formatDateForHistory, formatNumber } from "../../../../utilities/utilities";
import { FaTrophy } from "react-icons/fa6";
import { Button } from "../../../../components/Button";
import { MdArrowBackIos } from "react-icons/md";
import { useWorkoutOnDayFetch } from "../../../../hooks/useWorkoutOnDayFetch";
import { selectUnitSystem } from "../../../../redux-store/SettingsSlice";

interface ShowWorkoutProps {
    setShowViewDay: (arg0: boolean) => void;
    setShowCalendar: (arg0: boolean) => void;
}

export const ShowWorkout: React.FC<ShowWorkoutProps> = ({ setShowViewDay, setShowCalendar }) => {
    useWorkoutOnDayFetch();
    
    const dispatch = useDispatch();
    const unit_system = useSelector(selectUnitSystem);

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
            className="phones:w-full xs:w-4/5 sm:w-3/5 md:w-1/2 lg:w-1/3 relative"
            className2={`${workoutOnDate.length === 0 ? "flex h-[45vh] items-center justify-between" : "flex flex-col justify-between"}`}
        >
               <button
                    onClick={() => handleNavigateBack()}
                    style={{ height: '0' }}
                    className="absolute top-4 left-2 sm:left-4 z-50"
                ><MdArrowBackIos className="sm:text-2xl text-lightestPurple"/></button>
            {workoutOnDate.length === 0 && (
                <span>There is no workout saved for this day.</span>
            )}

            <div className="max-h-[65vh]  overflow-y-auto">
            {workoutOnDate.map((exercise, index) => (
                <div key={index} >
                    {exercise.sets.length > 0 && (
                        <>
                            <h3 className="p-2 border-b-2 border-lightPurple font-semibold text-lg">{exercise.exercise_name}</h3>
                            <div className="p-3">
                                {exercise.sets.map((set, index) => (
                                    <div key={index} className="p-2 grid grid-cols-3 text-center items-center">
                                        <span>{set.pr && <span className="text-mediumPurple flex justify-end"><FaTrophy /></span>}</span>
                                       {unit_system === "metric" ? (
                                        <span className="flex justify-end">{formatNumber(set.weight)} kgs</span>
                                       ) : (
                                        <span className="flex justify-end">{formatNumber(set.weight_lbs)} lbs</span>
                                       )} 
                                        <span className="flex justify-end">{set.reps} reps</span>
                                    </div>
                                ))}
                            </div>
                        </>
                    )}
                </div>
            ))}
            </div>
            <div className="p-4 w-full flex justify-center space-x-4">
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