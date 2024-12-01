interface ButtonProps {
    onClick: () => void; // Function to execute on button click
    children: React.ReactNode; // Text or other elements as children
    className?: string; // Optional className for styling
}

export const Button: React.FC<ButtonProps> = ({ onClick, children, className }) => {
    return (
        <button
            onClick={onClick}
            className={`px-4 py-2 w-fit rounded-xl bg-darkestPurple hover:bg-darkPurple text-lightestPurple ${className || ""}`}
        >
            {children}
        </button>
    );
};