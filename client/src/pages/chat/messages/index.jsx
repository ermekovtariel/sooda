import { useEffect, useRef, useState } from "react";
import { useHttp } from "../../../hooks/http.hook";
import { useSelector } from "react-redux";
import { noneImage } from "../../../configs/utils";
import InputEmoji from 'react-input-emoji'
import PT from "prop-types";
import "./index.css";

const Messages = ({ chat, setSendMessage,  receivedMessage }) => {
    const { request } = useHttp();
    const scroll = useRef();
    const imageRef = useRef();

    const [messages, setMessages] = useState([]);
    const [newMessage, setNewMessage] = useState("");

    const userId = useSelector((state) => state.auth.user.id);


  // fetch messages
  useEffect(() => {
    const fetchMessages = async () => {
      try {
        const data = await request(
            `/message/${chat}`, 
            'GET',
            null,   
            {Authorization: localStorage.getItem("token")}
        );
        setMessages(data);
      } catch (error) {
        console.log(error);
      }
    };

    if (chat !== null) fetchMessages();
  }, [chat, request]);


  // Always scroll to last Message
  useEffect(()=> {
    scroll.current?.scrollIntoView({ behavior: "smooth" });
  },[messages])



  // Send Message
  const handleSend = async(e)=> {
    e.preventDefault()
    const message = {
      senderId : userId,
      text: newMessage,
      chatId: chat,
  }
  const receiverId = chat?.members?.find((id)=>id !== userId);
  // send message to socket server
  setSendMessage({...message, receiverId})
  // send message to database
  try {
    const data = await request(
        `/message/`, 
        'POST',
        messages,   
        {Authorization: localStorage.getItem("token")}
    );

    setMessages([...messages, data]);
    setNewMessage("");
  }
  catch
  {
    console.log("error")
  }
 }

 // Receive Message from parent component
 useEffect(()=> {
   console.log("Message Arrived: ", receivedMessage)
   if (receivedMessage !== null && receivedMessage.chatId === chat) {
     setMessages([...messages, receivedMessage]);
   }
 
 },[chat, messages, receivedMessage])


  const handleChange = (newMessage)=> {
    setNewMessage(newMessage)
  }


  return (
    <div>
            {/* chat-header */}
            <div className="chat-header">
              <div className="follower">
                <div>
                  <img
                    src={noneImage}
                    alt="Profile"
                    className="followerImage"
                    style={{ width: "50px", height: "50px" }}
                  />
                  <div className="name" style={{ fontSize: "0.9rem" }}>
                    <span>
                    firstname lastname
                    </span>
                  </div>
                </div>
              </div>
              <hr
                style={{
                  width: "95%",
                  border: "0.1px solid #ececec",
                  marginTop: "20px",
                }}
              />
            </div>
            {/* chat-body */}
            <div className="chat-body" >
              {messages.map((message) => (
                <>
                  <div ref={scroll}
                    className={
                      message.senderId === userId
                        ? "message own"
                        : "message"
                    }
                  >
                    <span>{message.text}</span>{" "}
                    {/* <span>{format(message.createdAt)}</span> */}
                  </div>
                </>
              ))}
            </div>
            {/* chat-sender */}
            <div className="chat-sender">
              <div onClick={() => imageRef.current.click()}>+</div>
              <InputEmoji
                value={newMessage}
                onChange={handleChange}
              />
              <div className="send-button button" onClick = {handleSend}>Send</div>
              <input
                type="file"
                name=""
                id=""
                style={{ display: "none" }}
                ref={imageRef}
              />
            </div>{" "}
    </div>
  )
}


Messages.propTypes = {
  chat:PT.any,
  setSendMessage:PT.any,
  receivedMessage:PT.any,
}


export default Messages