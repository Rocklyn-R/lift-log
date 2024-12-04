import { useState } from "react";
import { FaPlus, FaMinus } from "react-icons/fa6";
import { MdArrowBackIos } from "react-icons/md";

interface LogFormProps {
    handleNavigateBack: () => void;
}

export const LogForm: React.FC<LogFormProps> = ({ handleNavigateBack }) => {
    const [weightInput, setWeightInput] = useState<number | undefined>(undefined);
    const [repsInput, setRepsInput] = useState<number | undefined>(undefined);

    // Calculate width: Start at 5rem for 5 or fewer characters, expand beyond that
    const weightInputLength = weightInput?.toString().length || 0;
    const calculatedWeightWidth = weightInputLength > 5 ? weightInputLength * 1 : 5;
    const repsInputLength = repsInput?.toString().length || 0;
    const calculatedRepsWidth = repsInputLength > 5 ? repsInputLength * 1 : 5;
    return (
        <div className="w-full flex justify-center relative my-4">
            <button
                onClick={handleNavigateBack}
                className="absolute top-0 left-6"
            ><MdArrowBackIos className="text-3xl text-darkestPurple hover:text-darkPurple" /></button>
            <form className="flex flex-col w-2/3 space-y-6">
                <div className="px-2 space-y-2 flex flex-col">
                    <h4 className="border-b-2 border-darkPurple">Weight (kgs)</h4>
                    <div className="flex space-x-2 justify-center w-1/2 self-center">
                        <button
                            type="button"
                            className="flex items-center bg-darkestPurple text-lightestPurple p-2 hover:bg-darkPurple"
                        >
                            <FaMinus />
                        </button>

                        <input
                            value={weightInput !== undefined ? weightInput : ""} // Ensure it's a string or empty
                            type="number"
                            step="0.1"
                            className="border-b-2 border-darkPurple focus:outline-none appearance-none bg-transparent text-2xl text-center"
                            style={{ width: `${calculatedWeightWidth}rem` }}
                            placeholder=""
                            onChange={(e) => {
                                const value = e.target.value;
                                if (value.length <= 8) {
                                    setWeightInput(value === "" ? undefined : Number(value)); // Clear or set number
                                }
                            }}
                        />


                        <button
                            type="button"
                            className="flex items-center bg-darkestPurple text-lightestPurple p-2 hover:bg-darkPurple"
                        >
                            <FaPlus />
                        </button>
                    </div>

                </div>
                <div className="px-2 space-y-2">
                    <h4 className="border-b-2 border-darkPurple">Reps</h4>
                    <div className="w-full flex space-x-2 justify-center">
                        <button
                            type="button"
                            className="flex items-center bg-darkestPurple text-lightestPurple p-2 hover:bg-darkPurple"
                        >
                            <FaMinus />
                        </button>
                        <input
                            value={repsInput !== undefined ? repsInput : ""}
                            type="number"
                            step="0.1"
                            className="border-b-2 border-darkPurple focus:outline-none appearance-none bg-transparent text-2xl text-center"
                            style={{ width: `${calculatedRepsWidth}rem` }}
                            placeholder=""
                            onChange={(e) => {
                                console.log(e.target.value);
                                const value = e.target.value;
                                if (value.length <= 8) {
                                    setRepsInput(value === "" ? undefined : Number(value)); // Clear or set number
                                }
                            }}

                        />
                        <button
                            type="button"
                            className="flex items-center bg-darkestPurple text-lightestPurple p-2 hover:bg-darkPurple"
                        >
                            <FaPlus />
                        </button>
                    </div>

                </div>
            </form>
        </div>

    )
}