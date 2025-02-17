interface ButtonProps {
    onClick?: () => void; // Function to execute on button click
    children: React.ReactNode; // Text or other elements as children
    className?: string; // Optional className for styling
    type: "submit" | "reset" | "button" | undefined;
    disabled?: boolean
    width?: string;
}

export const Button: React.FC<ButtonProps> = ({ width = "w-fit", onClick, children, className, type, disabled }) => {
    return (
        <button
            disabled={disabled}
            type={type}
            onClick={onClick}
            className={`${width} hover:shadow-lg transition py-2 px-4 rounded-lg bg-darkestPurple hover:bg-darkPurple text-lightestPurple ${className || ""}`}
        >
            {children}
        </button>
    );
};