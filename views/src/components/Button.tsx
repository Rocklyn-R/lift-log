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
            className={`${disabled ? "opacity-55" : "md:hover:bg-darkPurple dark:md:hover:bg-lightestPurple dark:md:hover:text-darkestPurple hover:md:shadow-lg active:bg-darkPurple active:text-lightestPurple dark:active:bg-lightestPurple dark:active:text-darkestPurple"} ${width} flex justify-center text-base transition py-2 px-4 rounded-lg border-2 border-transparent dark:border-mediumPurple dark:bg-darkPurple font-semibold bg-darkestPurple text-lightestPurple ${className || ""}`}
        >
            {children}
        </button>
    );
};