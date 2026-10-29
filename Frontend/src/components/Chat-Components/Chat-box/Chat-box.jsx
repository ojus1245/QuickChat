import React, { useEffect, useState, useContext } from "react";
import "./Chat-box.css";
import assets from "../../../assets/assets";
import { AppContext } from "../../../context/AppContext";
import {
  arrayUnion,
  doc,
  getDoc,
  onSnapshot,
  updateDoc,
} from "firebase/firestore";
import { auth, db } from "../../../config/firebase";
import { toast } from "react-toastify";

const Chatbox = () => {
  const date = new Date();
  const time = date.toLocaleTimeString("en-us", {
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  });

  const { userData, chatUser, messageId, messages, setMessages } =
    useContext(AppContext);

  const [input, setInput] = useState("");
  const uid = auth.currentUser?.uid;

  const sendMessage = async () => {
    try {
      if (input && messageId) {
        // Add message to messages collection
        await updateDoc(doc(db, "messages", messageId), {
          messages: arrayUnion({
            sId: userData.id,
            text: input,
            createdAt: new Date(),
          }),
        });

        // Update chat metadata for both users
        const userIDs = [chatUser.id, userData.id];
        for (const id of userIDs) {
          const chatRef = doc(db, "chats", id);
          const userChatSnapshot = await getDoc(chatRef);

          if (userChatSnapshot.exists()) {
            const userChatData = userChatSnapshot.data();
            const chatIndex = userChatData.chatData.findIndex(
              (c) => c.messageId === messageId
            );

            if (chatIndex !== -1) {
              userChatData.chatData[chatIndex].lastMessage = input.slice(0, 30);
              userChatData.chatData[chatIndex].updatedAt = Date.now();

              if (userChatData.chatData[chatIndex].rId === userData.id) {
                // receiver only
                userChatData.chatData = userChatData.chatData.map((chat) =>
                  chat.messageId === messageId
                    ? {
                        ...chat,
                        unreadCount: (chat.unreadCount || 0) + 1,
                        messageSeen: false,
                      }
                    : chat
                );
              }

              await updateDoc(chatRef, {
                chatData: userChatData.chatData,
              });
            }
          }
        }

        setInput(""); // ✅ clear input after sending
      }
    } catch (error) {
      console.error("Error sending message:", error.message);
    }
  };

  // useEffect(() => {
  //   if (messageId) {
  //     const unSub = onSnapshot(doc(db, "messages", messageId), (res) => {
  //       setMessages(res.data()?.messages || []);
  //     });
  //     return () => {
  //       unSub();
  //     };
  //   }
  // }, [messageId]);

  useEffect(() => {
    if (!messageId) return;

    const unSub = onSnapshot(doc(db, "messages", messageId), async (res) => {
      setMessages(res.data()?.messages || []);

      //  AUTO MARK AS READ
      const chatRef = doc(db, "chats", userData.id);
      const snap = await getDoc(chatRef);

      if (snap.exists()) {
        const data = snap.data();
        const index = data.chatData.findIndex((c) => c.messageId === messageId);

        if (index !== -1 && data.chatData[index].messageSeen === false) {
          data.chatData[index].messageSeen = true;
          await updateDoc(chatRef, {
            chatData: data.chatData,
          });
        }
      }
    });

    return () => unSub();
  }, [messageId]);

  const sendImage = async (e) => {
    try {
      const image = e.target.files[0];
      if (image) {
        const sigRes = await fetch("https://chatapp-gravitek.onrender.com", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            public_id: `chat-images/${uid}`,
            folder: "chat-images",
          }),
        });

        const { timestamp, signature, apiKey, cloudName } = await sigRes.json();

        const formData = new FormData();
        formData.append("file", image);
        formData.append("api_key", apiKey);
        formData.append("timestamp", timestamp);
        formData.append("signature", signature);
        formData.append("public_id", `chat-images/${uid}`);
        formData.append("folder", "chat-images");
        formData.append("overwrite", "true");

        const cloudRes = await fetch(
          `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`,
          {
            method: "POST",
            body: formData,
          }
        );

        const result = await cloudRes.json();
        const fileUrl = result.secure_url;

        if (fileUrl && messageId) {
          await updateDoc(doc(db, "messages", messageId), {
            messages: arrayUnion({
              sId: userData.id,
              image: fileUrl,
              createdAt: new Date(),
            }),
          });
          const userIDs = [chatUser.id, userData.id];
          for (const id of userIDs) {
            const chatRef = doc(db, "chats", id);
            const userChatSnapshot = await getDoc(chatRef);

            if (userChatSnapshot.exists()) {
              const userChatData = userChatSnapshot.data();
              const chatIndex = userChatData.chatData.findIndex(
                (c) => c.messageId === messageId
              );

              if (chatIndex !== -1) {
                userChatData.chatData[chatIndex].lastMessage = "Photo";
                userChatData.chatData[chatIndex].updatedAt = Date.now();

                if (userChatData.chatData[chatIndex].rId === userData.id) {
                  // receiver only
                  userChatData.chatData = userChatData.chatData.map((chat) =>
                    chat.messageId === messageId
                      ? {
                          ...chat,
                          unreadCount: (chat.unreadCount || 0) + 1,
                          messageSeen: false,
                        }
                      : chat
                  );
                }

                await updateDoc(chatRef, {
                  chatData: userChatData.chatData,
                });
              }
            }
          }
        }
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  return chatUser ? (
    <div className="chat-box">
      <div className="chat-topNav">
        <div className="chat-user">
          <img src={chatUser.profileImage} className="pfp1" alt="" />
          {Date.now() - chatUser.lastSeen <= 70000 ? (
            <img src={assets.green_dot} className="online-symbol" alt="" />
          ) : null}
          <p>{chatUser.username}</p>
        </div>
        <div className="personal">
          <img src={assets.help_icon} alt="" className="personal" />
        </div>
      </div>

      <div className="chat-message">
        {messages.map((msg, index) => (
          <div
            className={msg.sId === userData.id ? "s-msg" : "r-msg"}
            key={index}
          >
            <div>
              <img
                src={
                  msg.sId === userData.id
                    ? userData.profileImage
                    : chatUser.profileImage
                }
                alt=""
                className="pfp"
              />

              <p>
                {new Date(msg.createdAt?.seconds * 1000).toLocaleTimeString(
                  "en-us",
                  {
                    hour: "numeric",
                    minute: "2-digit",
                    hour12: true,
                  }
                )}
              </p>
            </div>
            {msg["image"] ? (
              <img src={msg.image} alt="" className="msg-img" />
            ) : (
              <p className="msg">{msg.text}</p>
            )}
          </div>
        ))}
      </div>

      <div className="chat-input">
        <input
          onChange={(e) => setInput(e.target.value)}
          value={input}
          type="text"
          placeholder="Message"
          className="message-box"
        />
        <input
          type="file"
          name="image"
          accept="image/jpeg,image/png"
          id="image"
          onChange={sendImage}
          hidden
        />
        <label htmlFor="image">
          <img src={assets.gallery_icon} alt="" className="image-input" />
        </label>
        <img src={assets.audio_icon} alt="" className="audio-input" />
        <img
          onClick={sendMessage}
          src={assets.send_button1}
          alt=""
          className="send-button"
        />
      </div>
    </div>
  ) : (
    <div className="chat-welcome">
      <img src={assets.logo_icon} alt="" />
      <p>Chat anytime, anywhere</p>
    </div>
  );
};

export default Chatbox;
