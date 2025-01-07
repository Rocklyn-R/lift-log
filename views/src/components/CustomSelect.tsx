import { useState, useRef, useEffect } from "react";

interface CustomSelectProps {
    options: { id: string | number; name: string }[]; // Options array
    value: string; // Current selected value
    onChange: (selectedValue: string) => void; // Handler for selection
    placeholder?: string; // Placeholder text
    className?: string; // Additional custom classes

}
export const CustomSelect: React.FC<CustomSelectProps> = ({
    options,
    value,
    onChange,
    placeholder = "Select an option",
    className = "",
}) => {
    const [isOpen, setIsOpen] = useState(false);
    const selectRef = useRef<HTMLDivElement>(null);


    const handleSelect = (selectedName: string) => {
        onChange(selectedName); // Call the external handler
        setIsOpen(false); // Close the dropdown
    };

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (selectRef.current && !selectRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        };

        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, []);


    return (
        <div ref={selectRef} className={`relative ${className} mt-2`}>
            <div
                className={`${isOpen ? "ring-2 ring-darkPurple" : ""} ${
                    value ? "text-darkestPurple" : "text-gray-400"
                } min-h-12 p-3 w-full border border-gray-300 rounded-md bg-white cursor-pointer`}
                onClick={() => setIsOpen(!isOpen)}
            >
                {value || placeholder}
                <span className="absolute inset-y-0 right-3 flex items-center pointer-events-none">
                    <svg
                        className={`w-4 h-4 text-gray-500 transform transition-transform ${
                            isOpen ? "rotate-180" : ""
                        }`}
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                    >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M19 9l-7 7-7-7"
                        />
                    </svg>
                </span>
            </div>
            {isOpen && (
                <div className="text-darkestPurple absolute z-10 mt-1 w-full bg-white border border-gray-300 rounded-md shadow-lg max-h-[25vh] overflow-y-auto">
                    {options.map((option) => (
                        <div
                            key={option.id}
                            onClick={() => handleSelect(option.name)}
                            className="p-3 hover:bg-gray-100 cursor-pointer"
                        >
                            {option.name}
                        </div>
                    ))}
                </div>
            )}

        </div>
    );
};