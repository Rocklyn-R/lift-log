import { useState } from "react";
import { Eye, EyeOff } from "lucide-react"; 

interface CustomPasswordInputProps {
    value: string;
    name: string;
    placeholder?: string;
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    className?: string;
    required?: boolean
}

export const CustomPasswordInput: React.FC<CustomPasswordInputProps> = ({ required = false, className, value, name, placeholder, onChange }) => {
    const [showPassword, setShowPassword] = useState(false);

    return (
        <div className={`relative ${className}`}>
            <input
                value={value}
                type={showPassword ? "text" : "password"} // Toggle password visibility
                id={name}
                name={name}
                className="border-2 border-lightestPurple dark:bg-darkPurple dark:text-lightestPurple mt-2 p-3 w-full rounded-md focus:outline-none focus:ring-2 focus:ring-darkPurple pr-10"
                placeholder={placeholder || "Enter password"}
                onChange={onChange}
                required={required}
            />
            {/* Eye Icon for toggling visibility */}
            <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute top-6 right-3 flex items-center text-gray-600 hover:text-gray-900"
            >
                {showPassword ? <Eye size={20} color="#b3b3b3" /> : <EyeOff color="#b3b3b3" size={20} />}
            </button>
        </div>
    );
};
