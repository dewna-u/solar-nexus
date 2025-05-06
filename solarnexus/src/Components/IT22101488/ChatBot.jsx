import React, { useState, useEffect, useRef } from "react";
import axios from "axios";

function ChatBot() {
  const [messages, setMessages] = useState([]);
  const [userInput, setUserInput] = useState("");
  const messagesEndRef = useRef(null);

  const sendMessage = async () => {
    if (!userInput.trim()) return;

    const newMessages = [...messages, { sender: "user", text: userInput }];
    setMessages(newMessages);
    setUserInput("");

    try {
      const response = await axios.post("http://localhost:5000/api/chatbot/ask", {
        message: userInput,
      });

      setMessages((prev) => [...prev, { sender: "bot", text: response.data.reply }]);
    } catch {
      setMessages((prev) => [...prev, { sender: "bot", text: "❌ Error getting response." }]);
    }
  };

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  return (
    <div style={styles.chatContainer}>
      <h2 style={styles.header}>🤖 Smart AI Assistant</h2>
      <div style={styles.messages}>
        {messages.map((msg, i) => (
          <div key={i} style={msg.sender === "user" ? styles.userMsg : styles.botMsg}>
            {msg.text}
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>
      <div style={styles.inputContainer}>
        <input
          type="text"
          placeholder="Type your message..."
          value={userInput}
          onChange={(e) => setUserInput(e.target.value)}
          style={styles.input}
          onKeyDown={(e) => e.key === "Enter" && sendMessage()}
        />
        <button onClick={sendMessage} style={styles.button}>Send</button>
      </div>
    </div>
  );
}

const styles = {
  chatContainer: {
    maxWidth: 600,
    margin: "50px auto",
    padding: 25,
    borderRadius: "16px",
    background: "#fefefe",
    boxShadow: "0 8px 24px rgba(0,0,0,0.12)",
    fontFamily: "Segoe UI, sans-serif",
  },
  header: {
    marginBottom: 20,
    textAlign: "center",
    color: "#333",
  },
  messages: {
    height: 350,
    overflowY: "auto",
    marginBottom: 15,
    padding: "10px 15px",
    borderRadius: "12px",
    background: "#f4f6f8",
    border: "1px solid #e0e0e0",
    display: "flex",
    flexDirection: "column",
    gap: 8,
  },
  userMsg: {
    alignSelf: "flex-end",
    background: "#d0f0c0",
    padding: "10px 14px",
    borderRadius: "18px 18px 0 18px",
    maxWidth: "80%",
    boxShadow: "0 1px 4px rgba(0,0,0,0.1)",
  },
  botMsg: {
    alignSelf: "flex-start",
    background: "#ffe0e0",
    padding: "10px 14px",
    borderRadius: "18px 18px 18px 0",
    maxWidth: "80%",
    boxShadow: "0 1px 4px rgba(0,0,0,0.1)",
  },
  inputContainer: {
    display: "flex",
    gap: 10,
    marginTop: "auto",
  },
  input: {
    flex: 1,
    padding: "12px 16px",
    borderRadius: "10px",
    border: "1px solid #ccc",
    fontSize: "16px",
  },
  button: {
    padding: "12px 20px",
    background: "#006eff",
    color: "#fff",
    border: "none",
    borderRadius: "10px",
    fontSize: "16px",
    cursor: "pointer",
    transition: "background 0.3s",
  },
};

export default ChatBot;
