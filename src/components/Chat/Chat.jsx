import { useEffect, useRef, useState } from "react";
import {
  collection,
  addDoc,
  serverTimestamp,
  onSnapshot,
  query,
  orderBy,
} from "firebase/firestore";
import moment from "moment";
import InputEmojiWithRef from "react-input-emoji";
import { db } from "../../index";
import Skeleton, { SkeletonTheme } from "react-loading-skeleton";

const Chat = ({ activeChat, currentUser }) => {
  const [value, setValue] = useState("");
  const [messages, setMessages] = useState(null);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    if (!activeChat) return;

    const messagesRef = collection(db, "chats", activeChat, "messages");
    const q = query(messagesRef, orderBy("createdAt"));

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const loadedMessages = snapshot.docs.map((doc) => doc.data());
      setMessages(loadedMessages);
    });

    return () => unsubscribe(); // Відписка від оновлень при зміні чату або компонента
  }, [activeChat]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handlerSendMessage = async () => {
    if (value.trim() === "") {
      console.log("Message is empty");
      return;
    }

    if (!activeChat) {
      console.error("No active chat selected");
      return;
    }

    if (
      !currentUser ||
      !currentUser.uid ||
      !currentUser.displayName ||
      !currentUser.photoURL
    ) {
      console.error("Incomplete user data:", currentUser);
      return;
    }

    try {
      const messagesRef = collection(db, "chats", activeChat, "messages");
      await addDoc(messagesRef, {
        id: currentUser.uid,
        displayName: currentUser.displayName,
        photoURL: currentUser.photoURL,
        text: value,
        createdAt: serverTimestamp(),
      });
      console.log("Message sent successfully");
    } catch (error) {
      console.error("Error adding document: ", error);
    }

    setValue("");
  };

  function formatMessagesWithDates(messages) {
    const formattedMessages = [];
    let lastDate = null;

    messages.forEach((message) => {
      if (!message.createdAt || !message.createdAt.seconds) {
        // console.warn("Message without a valid timestamp:", message);
        return;
      }

      const timestamp = message.createdAt.seconds * 1000;
      const currentDate = moment(timestamp).format("YYYY-MM-DD");

      if (currentDate !== lastDate) {
        formattedMessages.push({
          timeOfWriting:
            moment().format("YYYY-MM-DD") === currentDate
              ? "today"
              : moment().subtract(1, "days").format("YYYY-MM-DD") ===
                currentDate
              ? "yesterday"
              : moment(currentDate).format("DD MMMM YYYY"),
        });
        lastDate = currentDate;
      }

      formattedMessages.push(message);
    });

    return formattedMessages;
  }

  console.log(messages, "messages");

  return (
    <div className="w-full sm:mt-0 md:w-[60%] h-[90%] flex flex-col justify-start items-center gap-2">
      <div className="relative flex flex-col gap-2 p-2 w-full h-full bg-white overflow-y-scroll rounded-md shadow-xl">
        {currentUser && messages ? (
          formatMessagesWithDates(messages).map(
            (
              { id, displayName, photoURL, text, createdAt, timeOfWriting },
              index
            ) => (
              <div key={index}>
                {timeOfWriting ? (
                  <p className="text-center opacity-25">{timeOfWriting}</p>
                ) : (
                  <div
                    className={`z-10 flex gap-1 ${
                      currentUser.uid === id ? "flex-row-reverse" : "flex-row"
                    }`}
                  >
                    <div className={`w-8 flex justify-center items-start`}>
                      <img
                        className="rounded-md text-[10px]"
                        src={photoURL}
                        alt={displayName}
                        referrerPolicy="no-referrer"
                      />
                    </div>
                    <div
                      className={`${
                        currentUser.uid === id
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
                )}
              </div>
            )
          )
        ) : (
          <SkeletonTheme baseColor="#d1d5db" highlightColor="#acb0b5">
            {[1, 2, 3, 4, 5, 6, 7, 8].map((value, indx) => (
              <p
                key={indx}
                className={`w-[20%] ${indx % 2 === 0 && "ml-auto"}`}
              >
                <Skeleton count={1} height={"40px"} />
              </p>
            ))}
          </SkeletonTheme>
        )}
        <div ref={messagesEndRef} />
      </div>
      <div className="w-full flex justify-center flex-row gap-2">
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
  );
};

export default Chat;
