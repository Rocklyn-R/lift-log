import Picker from "react-mobile-picker";
import { useState } from "react";

interface NumberPickerProps {
    maxNumber: number;
    value: number;
    onChange: (value: number) => void;
    label: string;
    separator?: boolean
}

export const NumberPicker: React.FC<NumberPickerProps> = ({ separator = false, label, maxNumber, value, onChange }) => {
    const [isScrolling, setIsScrolling] = useState(false);

    // Generate an array from 0 to maxNumber
    const numberOptions = Array.from({ length: maxNumber + 1 }, (_, i) => i);

    return (
        <div className="flex flex-col items-center relative"
            onTouchStart={() => setIsScrolling(true)}
            onTouchEnd={() => setIsScrolling(false)}
            onMouseDown={() => setIsScrolling(true)}
            onMouseUp={() => setIsScrolling(false)}
        >

            {label && <div className="text-xl font-semibold mb-6">{label}</div>}
            <Picker
                wheelMode="natural"
                height={100}
                value={{ selected: value }}
                onChange={(newValue) => onChange(newValue.selected)}
            >
                <Picker.Column name="selected">
                    {numberOptions.map((num, index) => (
                        <Picker.Item key={index} value={num}>
                            <div className={`text-2xl ${(num === value && !isScrolling) && "font-bold"} ${(num !== value && !isScrolling) && "text-gray-400 opacity-50"}`}>
                                {num}
                            </div>
                        </Picker.Item>
                    ))}
                </Picker.Column>
            </Picker>
            {separator && <span className="absolute font-bold text-3xl -right-5 top-[5.1rem]">:</span>}
        </div>
    );
};