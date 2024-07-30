import { useContext, useEffect, useRef, useState } from "react";
import { AuthContext, db } from "../../index";
import { useCollectionData } from "react-firebase-hooks/firestore";
import firebase from "firebase/compat/app";
import {
  addDoc,
  collection,
  orderBy,
  query,
  serverTimestamp,
} from "firebase/firestore";
import moment from "moment";
import InputEmojiWithRef from "react-input-emoji";

const Chat = ({ ...rest }) => {
  const { user } = rest;

  const userData = user.user;

  const [value, setValue] = useState("");
  const { auth, provider } = useContext(AuthContext);

  const messagesRef = collection(db, "messages");
  const q = query(messagesRef, orderBy("createdAt"));
  const [messages, loading, error] = useCollectionData(q, { idField: "id" });

  const messagesEndRef = useRef(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handlerSendMessage = async () => {
    if (value.trim() === "") return;

    if (
      !userData ||
      !userData.uid ||
      !userData.displayName ||
      !userData.photoURL
    ) {
      console.error("User data is missing");
      return;
    }

    console.log(userData, "userData");

    try {
      await addDoc(messagesRef, {
        id: userData.uid,
        displayName: userData.displayName,
        photoURL: userData.photoURL,
        text: value,
        createdAt: serverTimestamp(),
      });
    } catch (error) {
      console.error("Error adding document: ", error);
    }

    setValue("");
  };

  return (
    <div className="bg-slate-100 w-full h-[94%] ">
      <h2 className="text-2xl text-center">CHAT</h2>
      <div className="w-full h-[90%] flex flex-col justify-center items-center gap-2">
        <div className="flex flex-col gap-2 p-2 w-[95%] md:w-[30%] h-[80%] bg-white border-[1px] border-black overflow-y-scroll">
          {userData && messages
            ? messages.map(({ id, displayName, photoURL, text, createdAt }) => {
                return (
                  <div
                    className={`flex gap-1 ${
                      userData.uid === id ? "flex-row-reverse" : "flex-row"
                    }`}
                  >
                    <div
                      className={`w-8 flex justify-center items-start  `}
                    >
                      <img
                        className="rounded-md"
                        src={photoURL}
                        alt="user photo"
                      />
                    </div>
                    <div
                      key={id}
                      className={`${
                        userData.uid === id
                          ? "ml-auto bg-blue-300"
                          : "bg-gray-300"
                      } text-black p-2 rounded-lg w-max max-w-[50%] break-words`}
                    >
                      <div className="flex gap-1 items-end break-words ">
                        <p className="w-max break-words">{text}</p>
                        <p className="text-[10px] w-max relative top-[6px]">
                          {createdAt?.seconds
                            ? moment(createdAt.seconds * 1000).format("HH:mm")
                            : ""}
                        </p>
                      </div>
                    </div>
                  </div>
                );
              })
            : "loading..."}
          <div ref={messagesEndRef} />
        </div>
        <div className="w-[95%] md:w-[30%] flex justify-center flex-row gap-2">
          {/* <input
            type="text"
            className="p-2"
            value={value}
            onChange={(e) => setValue(e.target.value)}
          /> */}
          <InputEmojiWithRef
            value={value}
            onChange={setValue}
            cleanOnEnter
            onEnter={handlerSendMessage}
            placeholder="Type a message"
          />
          <button
            onClick={handlerSendMessage}
            type="submit"
            className="p-2 text-lg rounded-lg bg-slate-400 hover:bg-slate-300 transition-bg duration-150"
          >
            Send
          </button>
        </div>
      </div>
    </div>
  );
};

export default Chat;
