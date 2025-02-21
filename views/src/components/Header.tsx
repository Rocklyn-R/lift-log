interface HeaderProps {
    text: string;
}

export const Header: React.FC<HeaderProps> = ({ text }) => {
    return (
        <div className="w-full dark:border-b-2 dark:border-lightestPurple">
            <h1 className="text-lightestPurple bg-darkestPurple text-xl font-semibold text-center p-5 sticky top-0 z-10">
                {text}
            </h1>
        </div>
    )
}