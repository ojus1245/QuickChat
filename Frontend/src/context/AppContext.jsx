import { doc, getDoc, onSnapshot, updateDoc } from "firebase/firestore";
import { createContext, useEffect, useState } from "react";
import { db } from "../config/firebase";
import { getAuth } from "firebase/auth";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

export const AppContext = createContext();

const AppContextProvider = (props) => {
  const navigate = useNavigate();
  const auth = getAuth();
  const [userData, setUserData] = useState(null);
  const [chatData, setChatData] = useState(null);
  const [messageId, setMessageId] = useState(null);
  const [messages, setMessages] = useState([]);
  const [chatUser, setChatUser] = useState(null);
  

  const loadUserData = async (uid) => {
    try {
      const userRef = doc(db, "users", uid);
      const userSnap = await getDoc(userRef);
      if (!userSnap.exists()) {
        console.warn("User document does not exist in Firestore for UID:", uid);
        navigate("/Profile");
        return;
      }
      const userData = userSnap.data();
      setUserData(userData);
      if (userData.profileImage && userData.username) {
        navigate("/Chat");
      } else {
        navigate("/Profile");
      }
      await updateDoc(userRef, {
        lastSeen: Date.now(),
      });
      setInterval(async () => {
        if (auth.chatUser) {
          await updateDoc(userRef, {
            lastSeen: Date.now(),
          });
        }
      }, 60000);
    } catch (error) {
      toast.error("Failed to load user data");
      console.error("Error loading user data:", error);
    }
  };
  useEffect(() => {
    if (userData) {
      const chatRef = doc(db, "chats", userData.id);
      const unSub = onSnapshot(chatRef, async (res) => {
        const chatItems = res.data().chatData;
        const temp = [];
        for (const items of chatItems) {
          const userRef = doc(db, "users", items.rId);
          const userSnap = await getDoc(userRef);
          const userData = userSnap.data();
          temp.push({ ...items, userData });
        }
        setChatData(temp.sort((a, b) => b.updatedAt - a.updatedAt));
      });
      return () => {
        unSub();
      };
    }
  }, [userData]);

  const value = {
    userData,
    setUserData,
    chatData,
    setChatData,
    loadUserData,
    messages,setMessages,
    messageId,setMessageId,
    chatUser, setChatUser,
  };
  return (
    <AppContext.Provider value={value}>{props.children}</AppContext.Provider>
  );
};

export default AppContextProvider;

