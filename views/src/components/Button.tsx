interface ButtonProps {
    onClick?: () => void; // Function to execute on button click
    children: React.ReactNode; // Text or other elements as children
    className?: string; // Optional className for styling
    type: "submit" | "reset" | "button" | undefined;
}

export const Button: React.FC<ButtonProps> = ({ onClick, children, className, type }) => {
    return (
        <button
            type={type}
            onClick={onClick}
            className={`py-2 px-4 w-fit rounded-lg bg-darkestPurple hover:bg-darkPurple text-lightestPurple font-semibold ${className || ""}`}
        >
            {children}
        </button>
    );
};