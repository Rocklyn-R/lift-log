import { useState } from "react";
import { Button } from "../../../../components/Button";
import { CustomNumberInput } from "../../../../components/CustomNumberInput";
import { useSelector } from "react-redux";
import { selectHours, selectMinutes, selectSeconds, setTimerTime } from "../../../../redux-store/TimeSlice";
import { useDispatch } from "react-redux";
import { addTimer, updateTimer } from "../../../../api/timers";
import { NumberPicker } from "../../../../components/NumberPicker";

interface EditTimerProps {
    setShowEditTimer: (arg0: boolean) => void;
    play: () => void;
}

export const EditTimer: React.FC<EditTimerProps> = ({ setShowEditTimer, play }) => {
    const hoursSet = useSelector(selectHours);
    const minutesSet = useSelector(selectMinutes);
    const secondsSet = useSelector(selectSeconds);
    const [hours, setHours] = useState(hoursSet);
    const [minutes, setMinutes] = useState(minutesSet);
    const [seconds, setSeconds] = useState(secondsSet);
    const dispatch = useDispatch();


    const isButtonDisabled = hours === 0 && minutes === 0 && seconds === 0;

    const handleSetTimer = async () => {
        if (!isButtonDisabled) {
            const seconds_left = (hours * 3600) + (minutes * 60) + seconds
            dispatch(setTimerTime({
                hours,
                minutes,
                seconds,
                seconds_left
            }))
        }
        if (hoursSet === 0 && minutesSet === 0 && secondsSet === 0) {
            const secondsLeft = (hours * 3600) + (minutes * 60) + seconds;
            const timerCreation = await addTimer(hours, minutes, seconds, secondsLeft);
            if (timerCreation) {
                setShowEditTimer(false);
                play();
            }
        } else {
            const secondsLeft = (hours * 3600) + (minutes * 60) + seconds;
            const timerUpdateResult = await updateTimer(hours, minutes, seconds, secondsLeft);
            if (timerUpdateResult) {
                setShowEditTimer(false);
                play();
            }

        }

    }
    return (
        <div className="flex flex-col items-center justify-between h-full space-y-4 w-full p-10">
            <h2 className="text-xl font-semibold text-darkestPurple">Set Timer:</h2>
            <div className="font-semibold sm:grid hidden grid-cols-3 gap-12">
                <div className="flex flex-col items-center space-y-2">
                    <label htmlFor="hours" className="text-md font-medium dark:text-lightestPurple text-darkPurple">
                        Hours
                    </label>
                    <CustomNumberInput
                        min={0}
                        max={24}
                        value={hours}
                        onChange={(newValue) => setHours(newValue)}
                        disabledDecrement={hours === 0}
                        disabledIncrement={hours > 24}
                    />
                </div>
                <div className="flex flex-col items-center space-y-2">
                    <label htmlFor="minutes" className="text-md font-medium dark:text-lightestPurple text-darkPurple">
                        Minutes
                    </label>
                    <CustomNumberInput
                        min={0}
                        max={59}
                        value={minutes}
                        onChange={(newValue) => setMinutes(newValue)}
                        disabledDecrement={minutes === 0}
                        disabledIncrement={minutes > 59}
                    />
                </div>
                <div className="flex flex-col items-center space-y-2">
                    <label htmlFor="seconds" className="text-md font-medium dark:text-lightestPurple text-darkPurple">
                        Seconds
                    </label>
                    <CustomNumberInput
                        min={0}
                        max={59}
                        value={seconds}
                        onChange={(newValue) => setSeconds(newValue)}
                        disabledDecrement={seconds === 0}
                        disabledIncrement={seconds > 59}
                    />
                </div>
            </div>
            <div className="grid sm:hidden grid-cols-3 gap-12">
                <NumberPicker
                    maxNumber={24}
                    value={hours}
                    label="Hours"
                    onChange={setHours}
                    separator={true}
                />
                <NumberPicker
                    maxNumber={59}
                    value={minutes}
                    label="Minutes"
                    onChange={setMinutes}
                    separator={true}
                />
                <NumberPicker
                    maxNumber={59}
                    value={seconds}
                    label="Seconds"
                    onChange={setSeconds}
                />
            </div>
            <Button
                type="button"
                disabled={isButtonDisabled}  // Disable button if all are 0
                onClick={() => handleSetTimer()}
                className={`border-2 font-semibold hover:shadow-lg transition py-2 px-4 w-fit rounded-lg bg-darkestPurple text-lightestPurple
          ${isButtonDisabled ? 'bg-opacity-50 hover:shadow-none cursor-not-allowed' : 'hover:bg-darkPurple'}`}
            >
                Start
            </Button>
        </div>
    )
}