// src/Chat.tsx (TypeScript version)

import React, { useState, useEffect, useRef } from 'react';
import { deleteChat, getChat, saveChat, updateChat} from './core/_requests';
import { toast } from 'react-toastify';
import './Chat.css';
import { useAuth } from '../../modules/auth';

const Chat: React.FC = () => {
  const [messages, setMessages] = useState<string[]>([]);
  const [input, setInput] = useState<string>('');
  const [ws, setWs] = useState<WebSocket | null>(null); // Correctly typed
  const messagesEndRef = useRef<HTMLDivElement | null>(null);

  const [loading, setLoading] = useState(false);
  const [chat, setChat] = useState<any[]>([]);
  const {currentUser, logout} = useAuth();

console.log('chatcurrentUser', currentUser);

  const chatList = async () => {
    setLoading(true);
    const response = await getChat();
    setChat(response.output);
    setLoading(false);
}

//   useEffect(() => {
//     // Initialize WebSocket connection
//     const socket = new WebSocket('ws://localhost:8080');
//     setWs(socket);

//     socket.onmessage = (event) => {
//       setMessages((prevMessages) => [...prevMessages, event.data]);
//     };

//     return () => {
//       socket.close();
//     };
//   }, []);

//   useEffect(() => {
//     // Scroll to the bottom when messages change
//     messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
//   }, [messages]);

//   const handleSendMessage = () => {
//     if (ws && input.trim()) {
//       ws.send(input);
//       setMessages((prevMessages) => [...prevMessages, `You: ${input}`]);
//       setInput('');
//     }
//   };

const handleSubmit = async (e) => {
    e.preventDefault();
    let messageID = (document.getElementById('messages') as HTMLInputElement).value;
    if(messageID.length > 0) {
    const response = await saveChat({messages: messageID})
    console.log('ressssponsee', response.status);
    
    if(response.status == 200) {
        (document.getElementById('messages') as HTMLInputElement).value = "";
        chatList();
        toast.success(response.message, {
            position: "bottom-center",
            autoClose: 5000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
            theme: "light",
        });
    } else {
        toast.error(response.message, {
            position: "bottom-center",
            autoClose: 5000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
            theme: "light",
        });
    }} else {
        toast.warn('Please Enter name..', {
            position: "bottom-center",
            autoClose: 5000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
            theme: "light",
        }); 
    }
}

const emptyValue = () => {
    (document.getElementById('messages') as HTMLInputElement).value = "";
}

  useEffect(() => {
    chatList();
  },[])

  return (
    <form onSubmit={handleSubmit}>
    <div className="chat-container">
      <div className="chat-header bg-primary">
        <h2 className='m-4 text-white text-center'>{currentUser?.first_name}</h2>
      </div>
      <div className="chat-messages">
        {/* {chat.map((item, i) => {
            return (
                <div>
                    <h1>{item.messages}</h1>
                </div>
            )
        })} */}
        <div className="message-container">
            {chat.map((item, i) => (
                <div 
                    key={i} 
                    className={`message ${item.user_id == currentUser?.id ? 'right' : 'left'}`}
                >
                    <h1>{item.messages}</h1>
                    <p style={{ fontSize: '10px' }}>{item.created_date}</p>
                </div>
            ))}
        </div>

        <div ref={messagesEndRef} />
      </div>
      <div className="chat-input">
        <input
          type="text"
        //   value={input}
          id='messages'
          onChange={(e) => setInput(e.target.value)}
          placeholder="Type a message..."
        />
        {/* <button onClick={handleSendMessage}>Send</button> */}
        <button onClick={handleSubmit}>Send</button>
      </div>
    </div>
    </form>
  );
};

export default Chat;
