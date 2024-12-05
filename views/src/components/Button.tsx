interface ButtonProps {
    onClick: () => void; // Function to execute on button click
    children: React.ReactNode; // Text or other elements as children
    className?: string; // Optional className for styling
    type: "submit" | "reset" | "button" | undefined;
}

export const Button: React.FC<ButtonProps> = ({ onClick, children, className, type }) => {
    return (
        <button
            type={type}
            onClick={onClick}
            className={`p-2 w-fit rounded-xl bg-darkestPurple hover:bg-darkPurple text-lightestPurple ${className || ""}`}
        >
            {children}
        </button>
    );
};