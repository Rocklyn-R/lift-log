import { IoCloseSharp } from "react-icons/io5";

interface OverlayWindowProps {
    onClose: () => void;
    headerText: string;
    children: React.ReactNode;
    className?: string;
    className2?: string;
}

export const OverlayWindow: React.FC<OverlayWindowProps> = ({
    onClose,
    headerText,
    children,
    className,
    className2
}) => {
    return (
        <div className="fixed inset-0 flex items-center justify-center z-50 w-full">
            {/* Background Overlay */}
            <div
                className="absolute inset-0 bg-black bg-opacity-50"
                onClick={onClose} // Close when clicking outside modal
            ></div>

            {/* Modal Content */}
            <div className={`${className || ""} relative bg-lightestPurple rounded-md shadow-lg`}>
                <div className="sticky flex justify-between items-center text-lightestPurple rounded-t-md bg-darkestPurple">
                    <h2 className="sm:text-lg mx-4 text-sm font-bold w-full text-center border-b-2 p-3 border-darkPurple">{headerText}</h2>
                    <button onClick={onClose}>
                        <IoCloseSharp className="absolute top-3.5 right-2 sm:right-3 sm:text-2xl" />
                    </button>
                </div>
                <div className={`${className2} flex flex-col z-20`}>{children}</div>
            </div>
        </div>
    );
};