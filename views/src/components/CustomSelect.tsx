import { useState, useRef, useEffect } from "react";

type SelectOption = string | { id: string | number; name: string };


interface CustomSelectProps {
    options: SelectOption[]
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
        <div ref={selectRef} className={`relative ${className}`}>
            {/* Hidden Input for Required Validation */}
            <input
                type="text"
                value={value || ""}
                required={true} // Enforces validation
                className="sr-only h-full w-full" // Hides input from UI
                onChange={() => { }} // Prevents React warnings
            />

            <div
                className={`${isOpen ? " border-2 border-mediumPurple dark:border-mediumPurple rounded-t-md" : "rounded-md border-2 dark:border-mediumPurple border-mediumPurple"} ${value ? "dark:text-lightestPurple text-darkestPurple" : "text-gray-400"
                    } font-semibold dark:bg-darkPurple min-h-12 p-3 w-full  bg-white cursor-pointer`}
                onClick={() => setIsOpen(!isOpen)}
            >
                {value || placeholder}
                <span className="absolute  inset-y-0 right-3 flex items-center pointer-events-none">
                    <svg
                        className={`w-4 h-4 dark:text-lightestPurple text-gray-500 transform transition-transform ${isOpen ? "rotate-180" : ""
                            }`}
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                    >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                </span>
            </div>

            {isOpen && (
                <div className="text-darkestPurple absolute z-10 -mt-1 w-full dark:bg-darkPurple dark:text-lightestPurple bg-white border-b-2 border-x-2 border-mediumPurple rounded-b-md shadow-lg max-h-[25vh] overflow-y-auto ">
                    {options.map((option) => {
                        const value = typeof option === "object" && "id" in option ? option.id : option;
                        const label = typeof option === "object" && "name" in option ? option.name : option;

                        return (
                            <div
                                key={value}
                                onClick={() => handleSelect(label)}
                                className="p-3 font-semibold dark:hover:bg-lightestPurple dark:hover:text-darkestPurple hover:bg-lightPurple cursor-pointer"
                            >
                                {label}
                            </div>
                        );
                    })}

                </div>
            )}
        </div>
    );
}    