import { IoCloseSharp } from "react-icons/io5";

interface OverlayWindowProps {
    onClose: () => void;
    headerText: string;
    children: React.ReactNode;
    className?: string;
}

export const OverlayWindow: React.FC<OverlayWindowProps> = ({
    onClose,
    headerText,
    children,
    className
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
                <div className="sticky flex justify-between items-center p-2 text-lightestPurple rounded-t-md bg-darkestPurple">
                    <h2 className="text-lg font-bold">{headerText}</h2>
                    <button onClick={onClose}>
                        <IoCloseSharp className="text-xl" />
                    </button>
                </div>
                <div className="pt-4 flex flex-col max-h-[55vh] min-h-[55vh] overflow-y-auto">{children}</div>
            </div>
        </div>
    );
};