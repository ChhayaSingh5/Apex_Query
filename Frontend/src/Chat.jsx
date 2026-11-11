import "./Chat.css";
import { useContext, useEffect, useState } from "react";
import { MyContext} from "./MyContext";
import ReactMarkdown from "react-markdown";
import rehypeHighlight from "rehype-highlight";
import "highlight.js/styles/github-dark.css";

function Chat() {
    const {newChat, prevChats, reply} = useContext(MyContext);
    const [typing, setTyping] = useState(null);

    useEffect(() => {
        if(reply === null || !prevChats?.length) {
            return;
        }

        const words = reply.split(" ");
        let index = 0;
        const interval = setInterval(() => {
            index++;
            setTyping({reply, content: words.slice(0, index).join(" ")});
            if(index >= words.length) {
                clearInterval(interval);
            }
        }, 40);

        return () => clearInterval(interval);
    }, [reply, prevChats]);

    return (
        <>
            {newChat && <h1>What's on your mind today?</h1>}
            <div className="chats">
                {prevChats?.map((chat, idx) => {
                    const isTypingLatestReply =
                        chat.role === "assistant" &&
                        idx === prevChats.length - 1 &&
                        reply === chat.content;

                    return (
                        <div className={chat.role === "user" ? "userDiv" : "gptDiv"} key={idx}>
                            {chat.role === "user" ? (
                                <p className="userMessage">{chat.content}</p>
                            ) : (
                                <ReactMarkdown rehypePlugins={[rehypeHighlight]}>
                                    {isTypingLatestReply
                                        ? typing?.reply === reply ? typing.content : ""
                                        : chat.content}
                                </ReactMarkdown>
                            )}
                        </div>
                    );
                })}
            </div>
        </>
    );
}

export default Chat;
