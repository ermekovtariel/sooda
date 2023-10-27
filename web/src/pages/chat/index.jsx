import { useRef, useState } from "react";
import { useEffect } from "react";
import { useSelector } from "react-redux";
import { io } from "socket.io-client";

import "./index.css";
import { useHttp } from "../../hooks/http.hook";
import Messages from "./messages";

const Chat = () => {
  const socket = useRef();
  const userId=useSelector((state) => state.auth.user.id);
  
  const { request } = useHttp();
  const [chats, setChats] = useState([]);
  const [onlineUsers, setOnlineUsers] = useState([]);
  const [currentChat, setCurrentChat] = useState(null);
  const [sendMessage, setSendMessage] = useState(null);
  const [receivedMessage, setReceivedMessage] = useState(null);


  useEffect(() => {
    const getChats = async () => {
      try {
        const data = await request(
            `/chat/${userId}`, 
            'GET',
            null,   
            {Authorization: localStorage.getItem("token")}
        );
        // console.log("chat", data);
        setChats(data);
      } catch (error) {
        console.log(error);
      }
    };
    getChats();
  }, [request, userId]);

  
  useEffect(() => {
    socket.current = io("ws://localhost:8800");
    socket.current.emit("new-user-add", userId);
    socket.current.on("get-users", (users) => {
      setOnlineUsers(users);
    });
  }, [userId]);

  // Send Message to socket server
  useEffect(() => {
    if (sendMessage!==null) {
      socket.current.emit("send-message", sendMessage);}
  }, [sendMessage]);


  // Get the message from socket server
  useEffect(() => {
    socket.current.on("recieve-message", (data) => {
      console.log("recieve-message", data)
      setReceivedMessage(data);
    });
  }, []);


  return (
    <div className="Chat">
      {/* Left Side */}
      <div className="Left-side-chat">
        LogoSearch
        <div className="Chat-container">
          <h2>Chats</h2>
          <div className="Chat-list">
            {chats.map(({ title="...", _id }) => (
              <div
                key={`chat_${_id}`}
                onClick={() => {
                    console.log(_id);
                  setCurrentChat(_id);
                }}
              >
                {title}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Right Side */}

      <div className="Right-side-chat">
        <div style={{ width: "20rem", alignSelf: "flex-end" }}>
            NavIcons
        </div>
        {currentChat&&<Messages 
            chat={currentChat}
            setSendMessage={setSendMessage}
            receivedMessage={receivedMessage}
        />}
      </div>
    </div>
  );
};

export default Chat;
