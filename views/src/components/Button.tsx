interface ButtonProps {
    onClick?: () => void; // Function to execute on button click
    children: React.ReactNode; // Text or other elements as children
    className?: string; // Optional className for styling
    type: "submit" | "reset" | "button" | undefined;
    disabled?: boolean
}

export const Button: React.FC<ButtonProps> = ({ onClick, children, className, type, disabled }) => {
    return (
        <button
            disabled={disabled}
            type={type}
            onClick={onClick}
            className={`hover:shadow-lg transition py-2 px-4 w-fit rounded-lg bg-darkestPurple hover:bg-darkPurple text-lightestPurple ${className || ""}`}
        >
            {children}
        </button>
    );
};