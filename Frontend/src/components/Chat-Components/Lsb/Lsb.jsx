import React, { useContext, useState } from "react";
import "./Lsb.css";
import assets from "../../../assets/assets";
import { useNavigate } from "react-router-dom";
import { logout } from "../../../config/firebase";
import { toast } from "react-toastify";
import {
  arrayUnion,
  collection,
  doc,
  getDoc,
  getDocs,
  query,
  serverTimestamp,
  setDoc,
  updateDoc,
  where,
} from "firebase/firestore";
import { db } from "../../../config/firebase";
import { AppContext } from "../../../context/AppContext";

const Lsb = () => {
  const [showMenu, setShowMenu] = React.useState(false);
  const Navigate = useNavigate();
  const { userData, chatData, chatUser, setChatUser, messageId, setMessageId } =
    useContext(AppContext);
  const unreadCount =
    chatData?.filter((chat) => chat.messageSeen === false).length || 0;
  const [user, setUser] = useState(null);
  const [showSearch, setShowSearch] = useState(false);

  const handleEdit = () => {
    setShowMenu(false);
    Navigate("/Profile");
  };

  const handleLogout = () => {
    setShowMenu(false);
    const confirmed = window.confirm("Are you sure you want to logout?");
    if (confirmed) {
      logout();
      toast.success("Logged out successfully!");
      Navigate("/Login");
    }
  };

  const inputHandler = async (e) => {
    try {
      const input = e.target.value.toLowerCase();
      if (input) {
        setShowSearch(true);
        const userRef = collection(db, "users");
        const q = query(userRef, where("username", "==", input));
        const querySnapshot = await getDocs(q);
        if (
          !querySnapshot.empty &&
          querySnapshot.docs[0].data().id !== userData.id
        ) {
          let userExist = false;
          chatData.map((user) => {
            if (user.rId == querySnapshot.docs[0].data().id) {
              userExist = true;
            }
          });

          if (!userExist) {
            setUser(querySnapshot.docs[0].data());
          }
        } else {
          setUser(null);
        }
      } else {
        setShowSearch(false);
      }
    } catch (error) {
      console.error("Error searching for user:", error);
      toast.error("Error searching for user");
    }
  };

  const addChat = async () => {
    const messageRef = collection(db, "messages");
    const chatRef = collection(db, "chats");

    try {
      const newMessageRef = doc(messageRef);
      await setDoc(newMessageRef, {
        createdAt: serverTimestamp(),
        messages: [],
      });

      const myChat = {
        messageId: newMessageRef.id,
        lastMessage: "",
        rId: user.id,
        updatedAt: Date.now(),
        messageSeen: true,
        unreadCount: 0,
      };

      const theirChat = {
        messageId: newMessageRef.id,
        lastMessage: "",
        rId: userData.id,
        updatedAt: Date.now(),
        messageSeen: true,
        unread: 0,
      };

      await setDoc(
        doc(chatRef, userData.id),
        {
          chatData: arrayUnion(myChat),
        },
        { merge: true }
      );

      await setDoc(
        doc(chatRef, user.id),
        {
          chatData: arrayUnion(theirChat),
        },
        { merge: true }
      );

      toast.success("Chat started!");
      setUser(null);
      setShowSearch(false);
    } catch (error) {
      console.error("Error creating chat:", error);
      toast.error("Failed to create chat");
    }
  };

  const setChat = async (item) => {
    setMessageId(item.messageId);
    setChatUser(item.userData);

    const userChatRef = doc(db, "chats", userData.id);
    const userChatSnapshot = await getDoc(userChatRef);
    const userChatData = userChatSnapshot.data();
    const chatIndex = userChatData.chatData.findIndex(
      (c) => c.messageId == item.messageId
    );
    userChatData.chatData[chatIndex].messageSeen = true;
    userChatData.chatData[chatIndex].unreadCount = 0;
    await updateDoc(userChatRef, {
      chatData: userChatData.chatData,
    });
  };

  return (
    <>
      {showMenu && (
        <div className="sub-menu">
          <p onClick={handleEdit}>Edit Profile</p>
          <hr />
          <p onClick={handleLogout}>Logout</p>
        </div>
      )}
      <div className="ls">
        <div className="ls-top">
          <img src={assets.logo} alt="" className="logo1" />

          <img
            src={assets.menu_icon}
            alt=""
            className="menu"
            onClick={() => {
              setShowMenu(!showMenu);
            }}
          />
        </div>

        <div className="ls-search">
          <img src={assets.search_icon} alt="" className="search" />
          <input
            type="text"
            placeholder="search here..."
            onChange={inputHandler}
          />
        </div>

        <div className="list-container">
          {showSearch && user ? (
            <div className="ls-list" onClick={addChat}>
              <div className="ls-friends">
                <img
                  src={user.profileImage || assets.profile_img}
                  alt=""
                  className="pfp"
                />

                <div className="details">
                  <p>{user.username}</p>

                  <span>Start a chat</span>
                </div>
              </div>
            </div>
          ) : (
            chatData.map((item, index) => (
              <div
                onClick={() => setChat(item)}
                key={index}
                className={`ls-list ${
                  item.messageSeen || item.messageId === messageId
                    ? ""
                    : "border"
                }`}
              >
                <div className="ls-friends">
                  <img
                    src={item.userData.profileImage}
                    alt=""
                    className="pfp"
                  />
                </div>
                <div className="details">
                  <p>{item.userData.username}</p>
                  <span>{item.lastMessage}</span>
                </div>
                {item.unreadCount > 0 && item.messageId !== messageId && (
                  <span className="chat-unread-count">{item.unreadCount}</span>
                )}
              </div>
            ))
          )}
        </div>
      </div>
    </>
  );
};

export default Lsb;
