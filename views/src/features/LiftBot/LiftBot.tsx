import { Header } from "../../components/Header";
import { useState, useRef, useEffect } from "react";
import { FaArrowUp } from "react-icons/fa6";
import { sendMessage } from "../../api/liftbot";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { useSelector } from "react-redux";
import { selectEffortScale, selectUnitSystem } from "../../redux-store/SettingsSlice";
import { selectBodyCompositionGoal, selectTrainingGoal, selectInjuries } from "../../redux-store/TrainingProfileSlice";


export const LiftBot = () => {
    const [messages, setMessages] = useState([
        { sender: "ai", text: "Hey! I'm LiftBot. Ask me anything about your workouts 💪" }
    ]);
    const [input, setInput] = useState("");
    const [waitingForResponse, setWaitingForResponse] = useState(false);
    const [needsContext, setNeedsContext] = useState(false);
    const effortScale = useSelector(selectEffortScale);
    const unit_system = useSelector(selectUnitSystem);
    const trainingGoal = useSelector(selectTrainingGoal);
    const bodyCompositionGoal = useSelector(selectBodyCompositionGoal);
    const injuries = useSelector(selectInjuries);
    const [currentFocus, setCurrentFocus] = useState({ type: 'no-context', lifts: [] });
    const [focusShiftMessage, setFocusShiftMessage] = useState("");
    const messagesContainerRef = useRef<HTMLDivElement | null>(null);



    const handleSend = async () => {
        if (!input.trim()) return;
        setWaitingForResponse(true);
        // Add user's message
        const newMessages = [...messages, { sender: "user", text: input }];
        setMessages(newMessages);
        setInput(""); // clear input
        const gptFormattedMessages = newMessages
            .filter((msg) => msg.sender === "user" || msg.sender === "ai")
            .map((msg) => ({
                role: msg.sender === "user" ? "user" : "assistant",
                content: msg.text
            }));

        // Simulate AI response (replace this with your API call)
        const data = await sendMessage(
            gptFormattedMessages,
            needsContext,
            effortScale,
            unit_system,
            trainingGoal,
            bodyCompositionGoal,
            injuries,
            focusShiftMessage,
            currentFocus
        );
        setTimeout(() => {
            setWaitingForResponse(false);
            setMessages(prev => [...prev, { sender: "ai", text: data.reply }]);
            if (!needsContext) {
                setNeedsContext(data.needsContext);
            }
            setFocusShiftMessage(data.focusShiftMessage);
            setCurrentFocus(data.conversationFocus)
        }, 500);
    };


    const textareaRef = useRef<HTMLTextAreaElement>(null);
    const [isScrollable, setIsScrollable] = useState(false);

    useEffect(() => {
        if (textareaRef.current) {
            textareaRef.current.style.height = "auto";

            const scrollHeight = textareaRef.current.scrollHeight;
            textareaRef.current.style.height = `${scrollHeight}px`;


            setIsScrollable(scrollHeight > 160);
        }
    }, [input]);

    useEffect(() => {
        const el = messagesContainerRef.current;
        if (!el) return;

        // Use requestAnimationFrame to ensure layout is finalized
        requestAnimationFrame(() => {
            el.scrollTop = el.scrollHeight;
        });
    }, [messages, waitingForResponse]);


    return (
        <div className="w-full h-screen flex flex-col xl:pl-0 pl-16">
            <Header text="LiftBot AI" />

            <div className="flex flex-col h-0 flex-grow overflow-hidden">
                {/* Messages */}
                <div ref={messagesContainerRef}
                    className="flex-1 scroll-smooth overflow-y-auto px-2 sm:px-10 md:px-14 lg:px-28 py-4 space-y-2">
                    {messages.map((msg, index) => (
                        <>
                            <div
                                key={index}
                                style={{ whiteSpace: "pre-line" }}
                                className={`liftbot-reply p-3 rounded-xl w-fit max-w-xl ${msg.sender === "user"
                                    ? "ml-auto dark:border-2 dark:border-mediumPurple dark:bg-darkPurple dark:text-white bg-blue-100 self-end text-left"
                                    : "dark:bg-lightestPurple dark:border-2 dark:border-mediumPurple dark:text-darkestPurple bg-gray-100 self-start"
                                    }`}
                            >
                                <ReactMarkdown remarkPlugins={[remarkGfm]}>
                                    {msg.text}
                                </ReactMarkdown>
                            </div>

                            {/* Only show typing indicator after the last message */}
                            {index === messages.length - 1 && waitingForResponse && (
                                <div className="w-fit bg-gray-200 dark:bg-lightestPurple rounded-xl px-4 py-2 max-w-xs self-start">
                                    <div className="flex space-x-1 animate-pulse">
                                        <div className="w-2 h-2 bg-gray-500 dark:bg-darkestPurple rounded-full"></div>
                                        <div className="w-2 h-2 bg-gray-500 dark:bg-darkestPurple rounded-full"></div>
                                        <div className="w-2 h-2 bg-gray-500 dark:bg-darkestPurple rounded-full"></div>
                                    </div>
                                </div>
                            )}
                        </>
                    ))}
                </div>



                {/* Input box - fixed at bottom, no growth */}
                <div className="border-t-2 border-mediumPurple px-2 sm:px-10 md:px-14 lg:px-28 py-4 flex gap-2 items-end">
                    <textarea
                        ref={textareaRef}
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        onKeyDown={(e) => {
                            if (e.key === "Enter" && !e.shiftKey) {
                                e.preventDefault();
                                handleSend();
                            }
                        }}
                        placeholder="Ask LiftBot something..."
                        rows={1}
                        className={`dark:bg-darkPurple dark:border-2 dark:border-mediumPurple w-full resize-none border dark:text-white rounded-xl px-4 pt-2 pb-[0.75rem] focus:outline-none ${isScrollable ? "overflow-y-auto" : "overflow-y-hidden"
                            }`}
                    />
                    <button
                        onClick={handleSend}
                        className="dark:bg-darkPurple dark:border-2 dark:border-mediumPurple dark:hover:bg-lightestPurple dark:hover:text-darkestPurple bg-darkestPurple text-white p-3 rounded-full"
                    >
                        <FaArrowUp />
                    </button>
                </div>
            </div>
        </div>

    );
};