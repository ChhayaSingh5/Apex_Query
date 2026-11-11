import "./Sidebar.css";
import { useCallback, useContext, useEffect } from "react";
import { MyContext } from "./MyContext";
import blackLogo from "./assets/blacklogo.png";

function Sidebar({onSessionExpired}) {
    const {
        allThreads, setAllThreads, currThreadId, setNewChat, setReply,
        setCurrThreadId, setPrevChats, startNewChat
    } = useContext(MyContext);

    const getAllThreads = useCallback(async () => {
        try {
            const response = await fetch("/api/thread");
            if (response.status === 401) {
                onSessionExpired();
                return;
            }
            if (!response.ok) {
                throw new Error(`Failed to load threads: ${response.status}`);
            }
            const res = await response.json();
            if (!Array.isArray(res)) {
                throw new Error("The threads API returned an invalid response");
            }
            const filteredData = res.map(thread => ({threadId: thread.threadId, title: thread.title}));
            //console.log(filteredData);
            setAllThreads(filteredData);
        } catch(err) {
            console.log(err);
        }
    }, [onSessionExpired, setAllThreads]);

    useEffect(() => {
        getAllThreads();
    }, [currThreadId, getAllThreads]);

    const changeThread = async (newThreadId) => {
        setCurrThreadId(newThreadId);

        try {
            const response = await fetch(`/api/thread/${newThreadId}`);
            if (response.status === 401) {
                onSessionExpired();
                return;
            }
            if (!response.ok) {
                throw new Error(`Failed to load thread: ${response.status}`);
            }
            const res = await response.json();
            //console.log(res);
            setPrevChats(res);
            setNewChat(false);
            setReply(null);
        } catch(err) {
            console.log(err);
        }
    }

    const deleteThread = async (threadId) => {
        try {
            const response = await fetch(`/api/thread/${threadId}`, {method: "DELETE"});
            if (response.status === 401) {
                onSessionExpired();
                return;
            }
            if (!response.ok) {
                throw new Error(`Failed to delete thread: ${response.status}`);
            }
            const res = await response.json();
            console.log(res);

            // updated threads re-render
            setAllThreads(prev => prev.filter(thread => thread.threadId !== threadId));

            if(threadId === currThreadId) {
                startNewChat();
            }

        } catch (err) {
            console.log(err);
        }
    }

    return (
        <section className="sidebar"> 
            {/* new chat button */}
            <button onClick={startNewChat}>
                <img src={blackLogo} alt="ApexQuery logo" className="logo"></img>
                <span><i className="fa-solid fa-pen-to-square"></i></span>
            </button>

            {/* history */}
            <ul className="history">
                {
                    allThreads?.map((thread, idx) => (
                        <li key={idx} 
                            onClick={() => changeThread(thread.threadId)}
                            className={thread.threadId === currThreadId ? "highlighted": " "}
                        >
                            {thread.title}
                            <i className="fa-solid fa-trash"
                                onClick={(e) => {
                                    e.stopPropagation();  // stop event bubbling
                                    deleteThread(thread.threadId);
                                }}
                            ></i>
                        </li>
                    ))
                }
            </ul>

            <div className="sign">
                <p>Developed by Chhaya &hearts;</p>
            </div>
        </section>

    )
}

export default Sidebar;