// ChatBot.jsx
import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import {
  Box,
  Typography,
  TextField,
  Button,
  Paper,
  Container,
  IconButton,
  Avatar,
  Divider,
  CircularProgress,
  createTheme,
  ThemeProvider,
  Card,
  CardHeader,
  CardContent,
} from "@mui/material";
import {
  Send as SendIcon,
  SmartToy as BotIcon,
  Person as PersonIcon,
  ArrowDownward as ScrollDownIcon,
} from "@mui/icons-material";

// Custom theme for chat interface
const theme = createTheme({
  palette: {
    primary: { main: "#3f51b5" },
    secondary: { main: "#f50057" },
    background: { default: "#f5f5f5", paper: "#ffffff" },
    user: { main: "#e3f2fd", contrastText: "#000000" },
    bot: { main: "#f3e5f5", contrastText: "#000000" },
  },
  typography: { fontFamily: "'Roboto','Segoe UI',sans-serif" },
  components: {
    MuiButton: {
      styleOverrides: {
        root: { borderRadius: 20, textTransform: "none" },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: { borderRadius: 16, boxShadow: "0 8px 40px rgba(0,0,0,0.12)" },
      },
    },
    MuiTextField: {
      styleOverrides: {
        root: { "& .MuiOutlinedInput-root": { borderRadius: 20 } },
      },
    },
  },
});

function ChatBot() {
  const [messages, setMessages] = useState([]);
  const [userInput, setUserInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [showScrollButton, setShowScrollButton] = useState(false);
  const messagesEndRef = useRef(null);
  const messagesContainerRef = useRef(null);
  const token = localStorage.getItem("token");

  const sendMessage = async () => {
    if (!userInput.trim()) return;
    setMessages((prev) => [...prev, { sender: "user", text: userInput }]);
    setUserInput("");
    setIsLoading(true);

    try {
      const response = await axios.post(
        "http://localhost:5000/api/chatbot/ask",
        { message: userInput },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setMessages((prev) => [...prev, { sender: "bot", text: response.data.reply }]);
    } catch (error) {
      setMessages((prev) => [
        ...prev,
        { sender: "bot", text: "❌ Error getting response. Please try again later." },
      ]);
      console.error("Error sending message:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleScroll = () => {
    const c = messagesContainerRef.current;
    if (!c) return;
    const { scrollTop, scrollHeight, clientHeight } = c;
    setShowScrollButton(scrollHeight - scrollTop - clientHeight > 100);
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    const c = messagesContainerRef.current;
    if (c) {
      c.addEventListener("scroll", handleScroll);
      return () => c.removeEventListener("scroll", handleScroll);
    }
  }, []);

  useEffect(() => {
    if (messages.length === 0) {
      setMessages([
        {
          sender: "bot",
          text: "👋 Hello! I'm your AI assistant. How can I help you today?",
        },
      ]);
    }
  }, []);

  return (
    <ThemeProvider theme={theme}>
      <Container maxWidth="sm" sx={{ py: 4 }}>
        <Card>
          <CardHeader
            title={
              <Box sx={{ display: "flex", alignItems: "center" }}>
                <BotIcon sx={{ mr: 1, color: "primary.main" }} />
                <Typography variant="h5" component="div">
                  Smart AI Assistant
                </Typography>
              </Box>
            }
            subheader="Ask me anything about your solar data"
          />
          <Divider />
          <CardContent sx={{ p: 2, position: "relative" }}>
            <Box
              ref={messagesContainerRef}
              sx={{
                height: 400,
                overflowY: "auto",
                display: "flex",
                flexDirection: "column",
                gap: 2,
                p: 2,
              }}
            >
              {messages.map((msg, i) => (
                <Box
                  key={i}
                  sx={{
                    display: "flex",
                    alignSelf: msg.sender === "user" ? "flex-end" : "flex-start",
                    alignItems: "flex-start",
                    maxWidth: "80%",
                  }}
                >
                  {msg.sender === "bot" && (
                    <Avatar sx={{ bgcolor: "primary.main", mr: 1, width: 32, height: 32 }}>
                      <BotIcon fontSize="small" />
                    </Avatar>
                  )}
                  <Paper
                    elevation={1}
                    sx={{
                      p: 1.5,
                      borderRadius:
                        msg.sender === "user"
                          ? "20px 20px 4px 20px"
                          : "20px 20px 20px 4px",
                      bgcolor:
                        msg.sender === "user" ? "user.main" : "bot.main",
                      color:
                        msg.sender === "user"
                          ? "user.contrastText"
                          : "bot.contrastText",
                    }}
                  >
                    <Typography variant="body1" sx={{ whiteSpace: "pre-wrap" }}>
                      {msg.text}
                    </Typography>
                  </Paper>
                  {msg.sender === "user" && (
                    <Avatar sx={{ bgcolor: "secondary.main", ml: 1, width: 32, height: 32 }}>
                      <PersonIcon fontSize="small" />
                    </Avatar>
                  )}
                </Box>
              ))}
              {isLoading && (
                <Box sx={{ display: "flex", alignItems: "center" }}>
                  <Avatar sx={{ bgcolor: "primary.main", mr: 1, width: 32, height: 32 }}>
                    <BotIcon fontSize="small" />
                  </Avatar>
                  <Paper
                    elevation={1}
                    sx={{
                      p: 1.5,
                      borderRadius: "20px 20px 20px 4px",
                      bgcolor: "bot.main",
                      display: "flex",
                      alignItems: "center",
                    }}
                  >
                    <CircularProgress size={20} thickness={5} sx={{ mr: 1 }} />
                    <Typography variant="body2">Thinking...</Typography>
                  </Paper>
                </Box>
              )}
              <div ref={messagesEndRef} />
            </Box>

            {showScrollButton && (
              <IconButton
                onClick={scrollToBottom}
                sx={{
                  position: "absolute",
                  bottom: 100,
                  right: 16,
                  bgcolor: "background.paper",
                }}
              >
                <ScrollDownIcon />
              </IconButton>
            )}

            <Box
              component="form"
              onSubmit={(e) => {
                e.preventDefault();
                sendMessage();
              }}
              sx={{ display: "flex", gap: 1, mt: 2, alignItems: "center" }}
            >
              <TextField
                fullWidth
                placeholder="Type your message…"
                value={userInput}
                onChange={(e) => setUserInput(e.target.value)}
                disabled={isLoading}
                variant="outlined"
                size="medium"
              />
              <Button
                variant="contained"
                color="primary"
                onClick={sendMessage}
                disabled={!userInput.trim() || isLoading}
                sx={{ width: 50, height: 50, borderRadius: "50%" }}
              >
                <SendIcon />
              </Button>
            </Box>
          </CardContent>
        </Card>
      </Container>
    </ThemeProvider>
  );
}

export default ChatBot;
