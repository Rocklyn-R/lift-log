import React from "react";
import { FaAngleUp, FaAngleDown } from "react-icons/fa";

interface CustomNumberInputProps {
    value: number;
    min: number;
    max: number;
    onChange: (value: number) => void;
    disabledDecrement: boolean;
    disabledIncrement: boolean;
}

export const CustomNumberInput: React.FC<CustomNumberInputProps> = ({
    value,
    min,
    max,
    onChange,
    disabledDecrement,
    disabledIncrement
}) => {

    const handleIncrement = () => {
        if (value < max) {
            onChange(value + 1); // Increment by 1
        }
    };

    const handleDecrement = () => {
        if (value > min) {
            onChange(value - 1); // Decrement by 1
        }
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const newValue = Math.max(min, Math.min(max, parseInt(e.target.value)));
        onChange(newValue);
    };

    return (
        <div className="relative flex items-center">
          {/* Increment Button */}
          <button
            onClick={handleDecrement}
            className={`${disabledDecrement ? "dark:opacity-75 opacity-55" : "dark:hover:bg-lightestPurple dark:hover:text-darkestPurple hover:bg-darkPurple"} text-lightestPurple bordr-2 border-mediumPurple bg-darkestPurple dark:bg-darkPurple absolute border-2 left-0 top-1/2 transform -translate-y-1/2 px-1 py-3 rounded-l-md `}
            disabled={disabledDecrement}
          >
            <FaAngleDown />
          </button>
          {/* Input Field */}
          <input
            type="number"
            value={value}
            min={min}
            max={max}
            onChange={handleInputChange}
            className="dark:bg-lightPurple bg-whitestPurple border-2 px-8 h-11 w-24 text-xl text-center border-mediumPurple rounded-md focus:outline-none ring-mediumPurple"
          />
          {/* Decrement Button */}
          <button
            onClick={handleIncrement}
            className={`${disabledIncrement ? "dark:opacity-75 opacity-65" : "dark:hover:bg-lightestPurple dark:hover:text-darkestPurple  hover:bg-darkPurple"} absolute border-2 border-mediumPurple bg-darkestPurple dark:bg-darkPurple right-0 top-1/2 transform -translate-y-1/2 px-1 py-3 rounded-r-md text-lightestPurple`}
            disabled={disabledIncrement}
          >
            <FaAngleUp />
          </button>
        </div>
      );
    };
    