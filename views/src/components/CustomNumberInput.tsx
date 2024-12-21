import React from "react";
import { FaAngleUp, FaAngleDown } from "react-icons/fa";

interface CustomNumberInputProps {
    value: number;
    min: number;
    max: number;
    onChange: (value: number) => void;
}

export const CustomNumberInput: React.FC<CustomNumberInputProps> = ({
    value,
    min,
    max,
    onChange,
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
        const newValue = Math.max(min, Math.min(max, parseInt(e.target.value) || 0));
        onChange(newValue);
    };

    return (
        <div className="relative flex items-center">
          {/* Increment Button */}
          <button
            onClick={handleDecrement}
            className="absolute bg-darkPurple left-0 top-1/2 transform -translate-y-1/2 px-1 py-3 rounded-l-md text-lightestPurple"
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
            className="px-8 h-10 w-24 text-xl text-center border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-darkPurple ring-2 ring-darkestPurple"
          />
          {/* Decrement Button */}
          <button
            onClick={handleIncrement}
            className="absolute right-0 top-1/2 bg-darkPurple transform -translate-y-1/2 px-1 py-3 rounded-r-md text-lightestPurple "
          >
            <FaAngleUp />
          </button>
        </div>
      );
    };
    