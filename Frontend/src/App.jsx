import './App.css';
import Sidebar from "./Sidebar.jsx";
import ChatWindow from "./ChatWindow.jsx";
import {MyContext} from "./MyContext.jsx";
import { useCallback, useEffect, useState} from 'react';
import {v1 as uuidv1} from "uuid";

function App() {
  const [flashMessage, setFlashMessage] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [authLoading, setAuthLoading] = useState(true);
  const [authError, setAuthError] = useState(null);
  const [prompt, setPrompt] = useState("");
  const [reply, setReply] = useState(null);
  const [currThreadId, setCurrThreadId] = useState(uuidv1());
  const [prevChats, setPrevChats] = useState([]);  //stores all chats of curr threads
  const [newChat, setNewChat] = useState(true); 
  const [allThreads, setAllThreads] = useState([]);

  const startNewChat = useCallback(() => {
    setNewChat(true);
    setPrompt("");
    setReply(null);
    setCurrThreadId(uuidv1());
    setPrevChats([]);
  }, []);

  const handleSessionExpired = useCallback(() => {
    setIsAuthenticated(false);
    setAllThreads([]);
    setPrevChats([]);
    setReply(null);
    setNewChat(true);
  }, []);

  useEffect(() => {
    const loadSession = async () => {
      try {
        const response = await fetch("/api/session");
        if (!response.ok) {
          throw new Error(`Failed to check login status: ${response.status}`);
        }
        const session = await response.json();
        setIsAuthenticated(session.authenticated);
      } catch (error) {
        console.error(error);
        setAuthError("Unable to connect to ApexQuery. Please refresh to try again.");
      } finally {
        setAuthLoading(false);
      }
    };

    const loadFlashMessage = async () => {
      try {
        const response = await fetch("/api/flash");
        if (!response.ok) {
          throw new Error(`Failed to load flash message: ${response.status}`);
        }

        const messages = await response.json();
        const message = messages.success?.[0] || messages.error?.[0];
        if (message) {
          setFlashMessage({
            type: messages.error?.length ? "danger" : "success",
            text: message,
          });
        }
      } catch (error) {
        console.error(error);
      }
    };

    loadSession();
    loadFlashMessage();
  }, []);

  // passing values
  const providerValues = {  
    prompt, setPrompt,
    reply, setReply,
    currThreadId, setCurrThreadId,
    newChat, setNewChat,
    prevChats, setPrevChats,
    allThreads, setAllThreads,
    isAuthenticated, setIsAuthenticated,
    startNewChat
  }

  if (authLoading) {
    return <main className="app-status">Loading ApexQuery...</main>;
  }

  if (authError) {
    return <main className="app-status" role="alert">{authError}</main>;
  }

  return (
    <div className='app'>
      <MyContext.Provider value={providerValues}>
        {flashMessage && (
          <div className={`flash-alert alert alert-${flashMessage.type} alert-dismissible fade show position-fixed top-0 start-50 translate-middle-x mt-3`} role="alert">
            {flashMessage.text}
            <button
              type="button"
              className="btn-close flash-alert-close"
              aria-label="Close"
              onClick={() => setFlashMessage(null)}
            />
          </div>
        )}
        {isAuthenticated && <Sidebar onSessionExpired={handleSessionExpired} />}
        <ChatWindow />
      </MyContext.Provider>
 
    </div>
  )
}

export default App
