import { Header } from "../../components/Header";
import { useState, useRef, useEffect } from "react";
import { FaArrowUp } from "react-icons/fa6";
import { sendMessage } from "../../api/liftbot";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { useSelector } from "react-redux";
import { selectEffortScale, selectUnitSystem } from "../../redux-store/SettingsSlice";


export const LiftBot = () => {
    const [messages, setMessages] = useState([
        { sender: "ai", text: "Hey! I'm LiftBot. Ask me anything about your workouts 💪" }
    ]);
    const [input, setInput] = useState("");
    const [waitingForResponse, setWaitingForResponse] = useState(false);
    const [needsContext, setNeedsContext] = useState(false);
    const effortScale = useSelector(selectEffortScale);
    const unit_system = useSelector(selectUnitSystem);

    const handleSend = async () => {
        if (!input.trim()) return;

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
        const data = await sendMessage(gptFormattedMessages, needsContext, effortScale, unit_system);
       setTimeout(() => {
            setMessages(prev => [...prev, { sender: "ai", text: data.reply }]);
            if (!needsContext) {
                setNeedsContext(data.needsContext);
            }
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

    return (
        <div className="w-full xl:pl-0 pl-16 h-screen flex flex-col">
            <Header text="LiftBot AI" />
            <div className="flex flex-col justify-between h-full">
                {/* Chat messages */}
                <div className={`flex flex-col overflow-y-auto px-28 py-4 space-y-2`}>
                    {messages.map((msg, index) => (
                        <div
                            key={index}
                            style={{ whiteSpace: "pre-line" }}
                            className={`liftbot-reply p-3 rounded-xl max-w-xl ${msg.sender === "user"
                                ? "dark:border-2 dark:border-mediumPurple dark:bg-darkPurple dark:text-white bg-blue-100 self-end text-left"
                                : "dark:bg-lightestPurple dark:border-2 dark:border-mediumPurple dark:text-darkestPurple bg-gray-100 self-start"
                                }`}
                        >
                            <ReactMarkdown remarkPlugins={[remarkGfm]}>{msg.text}</ReactMarkdown>
                        </div>
                    ))}
                </div>

                {/* Input box */}
                <div className="border-t-2 border-mediumPurple px-28 py-4 flex gap-2 items-end">
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
                        className={`dark:bg-darkPurple dark:border-2 dark:border-mediumPurple w-full resize-none border dark:text-white rounded-xl px-4 pt-2 pb-[0.75rem] focus:outline-none ${isScrollable ? "overflow-y-auto" : "overflow-y-hidden"}`}
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