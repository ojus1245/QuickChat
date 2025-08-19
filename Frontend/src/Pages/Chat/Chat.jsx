import React, { useContext } from "react";
import "./Chat.css";
import Lsb from "../../components/Chat-Components/Lsb/Lsb";
import Chatbox from "../../components/Chat-Components/Chat-box/Chat-box";
import Rsb from "../../components/Chat-Components/Rsb/Rsb";
import { AppContext } from "../../context/AppContext";
import { useState } from "react";
const Chat = () => {
  const { userData, chatData } = useContext(AppContext);
  const [loading, setLaoding] = useState(true);
  React.useEffect(() => {
    if (userData && chatData) {
      setLaoding(false);
    }
  }, [userData, chatData]);
  return (
    <>
      {loading ? (
        <div className="chat-frame">
          <p className="loading">Loading...</p>
        </div>
      ) : (
        <div className="chat-frame">
          <div className="container">
            <Lsb />
            <Chatbox />
            <Rsb />
          </div>
        </div>
      )}
    </>
  );
};

export default Chat;
