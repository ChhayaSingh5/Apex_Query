import "./ChatWindow.css";
import Chat from "./Chat.jsx";
import { MyContext } from "./MyContext.jsx";
import { useContext, useState } from "react";
import {RingLoader} from "react-spinners";

function ChatWindow() {
    const {
        prompt, setPrompt, setReply, currThreadId, prevChats, setPrevChats,
        setNewChat, isAuthenticated, setIsAuthenticated, startNewChat
    } = useContext(MyContext);
    const [loading, setLoading] = useState(false);
    const [isOpen, setIsOpen] = useState(false); // set default false value
    const [requestError, setRequestError] = useState(null);

    const getReply = async() => {
        const submittedPrompt = prompt.trim();
        if(!submittedPrompt || loading) {
            return;
        }

        setLoading(true);
        setRequestError(null);
        const conversation = [
            ...prevChats,
            {role: "user", content: submittedPrompt}
        ];
        const options = {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                message: submittedPrompt,
                threadId: currThreadId,
                messages: conversation
            })
        };
        try {
            const response = await fetch("/api/chat", options);
            if (!response.ok) {
                throw new Error(`Chat request failed: ${response.status}`);
            }
            const res = await response.json();
            setIsAuthenticated(res.authenticated);
            setPrevChats([
                ...conversation,
                {role: "assistant", content: res.reply}
            ]);
            setReply(res.reply);
            setNewChat(false);
            setPrompt("");
        } catch(err) {
            console.error(err);
            setRequestError("Unable to get a response. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    const handleProfileClick = () => {
        setIsOpen(!isOpen);
    }

    const handleLogout = () => {
        window.location.href = "/logout";
    }

    const handleNewGuestChat = () => {
        startNewChat();
    };

    return (
        <div className="chatWindow">
            <div className="navbar">
                <span>ApexQuery <i className="fa-solid fa-chevron-down"></i></span>
                
                <div className="navbar-nav">
                    {!isAuthenticated ? (
                        <>
                            <button type="button" onClick={handleNewGuestChat}>New chat</button>
                            <a className="nav-link" href="/signup">Sign up</a>
                            <a className="nav-link" href="/login">Log in</a>
                        </>
                    ) : (
                        <div className="userIconDiv" onClick={handleProfileClick}>
                            <span className="userIcon"><i className="fa-solid fa-user"></i></span>
                        </div>
                    )}
                </div>
            </div>

            {
                isAuthenticated && isOpen &&
                <div className="dropDown">
                    <div className="dropDownItem"><i className="fa-solid fa-gear"></i> Settings</div>
                    <div className="dropDownItem"><i className="fa-solid fa-cloud-arrow-up"></i> Upgrade plan </div>
                    <div className="dropDownItem" onClick={handleLogout}>
                        <i className="fa-solid fa-arrow-right-from-bracket"></i> Log out
                    </div>
                </div>

            }

            <Chat />

            <RingLoader color="#fff" loading={loading}>
            </RingLoader>
            <div className="chatInput">
                {requestError && <p className="request-error" role="alert">{requestError}</p>}
                <p className="info">
                    ApexQuery can make mistakes. Check important info.
                </p>

                <div className="inputBox"> 
                    <input placeholder="Ask ApexQuery" 
                        value={prompt}
                        onChange={(e) => setPrompt(e.target.value)}
                    onKeyDown={(e) => {
                        if(e.key === "Enter") {
                            e.preventDefault();
                            getReply();
                        }
                    }}
                    disabled={loading}
                    >

                    </input>
                    
                    <div id="submit" onClick={getReply} aria-label="Send message" role="button" tabIndex={0}>
                        <i className="fa-solid fa-paper-plane"></i>
                    </div>
                </div>
                
            </div>
        </div>
    )
}

export default ChatWindow;