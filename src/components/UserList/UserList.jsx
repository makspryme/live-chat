import React, { useState } from "react";
import {
  collection,
  doc,
  getDoc,
  query,
  setDoc,
  addDoc,
  serverTimestamp,
  getDocs,
} from "firebase/firestore";
import { useCollectionData } from "react-firebase-hooks/firestore";
import { db } from "../../index";
import Skeleton, { SkeletonTheme } from "react-loading-skeleton";
import Chat from "../Chat/Chat"; // Імпорт компонента Chat

const UserList = ({ user }) => {
  const currentUser = user.user;
  const [activeChat, setActiveChat] = useState(null);
  const [messages, setMessages] = useState([]);

  const userList = collection(db, "userList");
  const q = query(userList);
  const [userCollections, loading, error] = useCollectionData(q, {
    idField: "id",
  });

  console.log(currentUser, "currentUser");

  const getOrCreateChat = async (otherUser) => {
    const chatId = generateChatId(currentUser.email, otherUser.email);
    const chatRef = doc(db, "chats", chatId);

    const chatDoc = await getDoc(chatRef);
    if (!chatDoc.exists()) {
      await setDoc(chatRef, { participants: [currentUser, otherUser] });
    }

    setActiveChat(chatId);
    loadMessages(chatId);
  };

  const loadMessages = async (chatId) => {
    const messagesRef = collection(db, "chats", chatId, "messages");
    const q = query(messagesRef);
    const querySnapshot = await getDocs(q);
    const loadedMessages = querySnapshot.docs.map((doc) => doc.data());
    setMessages(loadedMessages);
  };

  const generateChatId = (user1Email, user2Email) => {
    return [user1Email, user2Email].sort().join("_");
  };

  return (
    <div className="flex h-full w-full justify-center gap-5 items-start p-[16px]">
      <div className="flex flex-col gap-2">
        {userCollections ? (
          userCollections.map((user) => {
            if (user.email === currentUser.email) return;
            return (
              <button
                key={user.id}
                className="flex items-center gap-1 p-1 bg-slate-400 text-black rounded-md"
                onClick={() => getOrCreateChat(user)}
              >
                <div className="relative w-10 ">
                  <img
                    className="text-[10px] rounded-full"
                    src={user.photoURL}
                    alt="user"
                    referrerPolicy="no-referrer"
                  />
                  <span
                    className={`absolute bottom-0 right-[5px] w-2 h-2 rounded-full border-[1px] border-white ${
                      user.online ? "bg-green-400" : "bg-red-500"
                    } `}
                  ></span>
                </div>
                <p className="truncate">{user.displayName}</p>
              </button>
            );
          })
        ) : (
          <SkeletonTheme baseColor="#d1d5db" highlightColor="#acb0b5">
            <p className="w-[305px]">
              <Skeleton count={8} height={"50px"} />
            </p>
          </SkeletonTheme>
        )}
      </div>

      {activeChat && (
        <Chat
          activeChat={activeChat}
          messages={messages}
          currentUser={currentUser}
        />
      )}
    </div>
  );
};

export default UserList;
