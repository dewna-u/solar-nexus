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
    primary: {
      main: "#3f51b5", // Indigo
      light: "#757de8",
      dark: "#002984",
      contrastText: "#ffffff",
    },
    secondary: {
      main: "#f50057", // Pink
      light: "#ff5983",
      dark: "#bb002f",
      contrastText: "#ffffff",
    },
    background: {
      default: "#f5f5f5",
      paper: "#ffffff",
    },
    user: {
      main: "#e3f2fd", // Light blue for user messages
      contrastText: "#000000",
    },
    bot: {
      main: "#f3e5f5", // Light purple for bot messages
      contrastText: "#000000",
    },
  },
  typography: {
    fontFamily: "'Roboto', 'Segoe UI', sans-serif",
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 20,
          textTransform: "none",
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 16,
          boxShadow: "0 8px 40px rgba(0,0,0,0.12)",
        },
      },
    },
    MuiTextField: {
      styleOverrides: {
        root: {
          "& .MuiOutlinedInput-root": {
            borderRadius: 20,
          },
        },
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

  const sendMessage = async () => {
    if (!userInput.trim()) return;

    const newMessages = [...messages, { sender: "user", text: userInput }];
    setMessages(newMessages);
    setUserInput("");
    setIsLoading(true);

    try {
      const response = await axios.post("http://localhost:5000/api/chatbot/ask", {
        message: userInput,
      });

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
    if (messagesContainerRef.current) {
      const { scrollTop, scrollHeight, clientHeight } = messagesContainerRef.current;
      const isScrolledUp = scrollHeight - scrollTop - clientHeight > 100;
      setShowScrollButton(isScrolledUp);
    }
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    const container = messagesContainerRef.current;
    if (container) {
      container.addEventListener("scroll", handleScroll);
      return () => container.removeEventListener("scroll", handleScroll);
    }
  }, []);

  // Add a welcome message if there are no messages
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
                <Typography variant="h5" component="div" fontWeight="500">
                  Smart AI Assistant
                </Typography>
              </Box>
            }
            subheader="Ask me anything about solar energy"
            sx={{ pb: 1 }}
          />

          <Divider />

          <CardContent sx={{ p: 2 }}>
            <Box
              ref={messagesContainerRef}
              sx={{
                height: 400,
                overflowY: "auto",
                display: "flex",
                flexDirection: "column",
                gap: 2,
                p: 2,
                bgcolor: "background.default",
                borderRadius: 2,
                position: "relative",
                "&::-webkit-scrollbar": {
                  width: "8px",
                },
                "&::-webkit-scrollbar-track": {
                  background: "#f1f1f1",
                  borderRadius: "4px",
                },
                "&::-webkit-scrollbar-thumb": {
                  background: "#bdbdbd",
                  borderRadius: "4px",
                },
                "&::-webkit-scrollbar-thumb:hover": {
                  background: "#9e9e9e",
                },
              }}
            >
              {messages.map((msg, i) => (
                <Box
                  key={i}
                  sx={{
                    display: "flex",
                    alignItems: "flex-start",
                    alignSelf: msg.sender === "user" ? "flex-end" : "flex-start",
                    maxWidth: "80%",
                  }}
                >
                  {msg.sender === "bot" && (
                    <Avatar
                      sx={{
                        bgcolor: "primary.main",
                        width: 32,
                        height: 32,
                        mr: 1,
                      }}
                    >
                      <BotIcon fontSize="small" />
                    </Avatar>
                  )}
                  <Paper
                    elevation={1}
                    sx={{
                      p: 1.5,
                      borderRadius: msg.sender === "user" ? "20px 20px 4px 20px" : "20px 20px 20px 4px",
                      bgcolor: msg.sender === "user" ? "user.main" : "bot.main",
                      color: msg.sender === "user" ? "user.contrastText" : "bot.contrastText",
                    }}
                  >
                    <Typography variant="body1" sx={{ whiteSpace: "pre-wrap" }}>
                      {msg.text}
                    </Typography>
                  </Paper>
                  {msg.sender === "user" && (
                    <Avatar
                      sx={{
                        bgcolor: "secondary.main",
                        width: 32,
                        height: 32,
                        ml: 1,
                      }}
                    >
                      <PersonIcon fontSize="small" />
                    </Avatar>
                  )}
                </Box>
              ))}
              {isLoading && (
                <Box
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    alignSelf: "flex-start",
                    maxWidth: "80%",
                  }}
                >
                  <Avatar
                    sx={{
                      bgcolor: "primary.main",
                      width: 32,
                      height: 32,
                      mr: 1,
                    }}
                  >
                    <BotIcon fontSize="small" />
                  </Avatar>
                  <Paper
                    elevation={1}
                    sx={{
                      p: 2,
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
              <Box
                sx={{
                  position: "absolute",
                  bottom: 100,
                  right: 30,
                  zIndex: 2,
                }}
              >
                <IconButton
                  color="primary"
                  onClick={scrollToBottom}
                  sx={{
                    bgcolor: "background.paper",
                    boxShadow: 2,
                    "&:hover": { bgcolor: "background.paper" },
                  }}
                >
                  <ScrollDownIcon />
                </IconButton>
              </Box>
            )}

            <Box
              component="form"
              onSubmit={(e) => {
                e.preventDefault();
                sendMessage();
              }}
              sx={{
                display: "flex",
                gap: 1,
                mt: 2,
                alignItems: "center",
              }}
            >
              <TextField
                fullWidth
                placeholder="Type your message..."
                value={userInput}
                onChange={(e) => setUserInput(e.target.value)}
                variant="outlined"
                size="medium"
                autoComplete="off"
                disabled={isLoading}
                InputProps={{
                  sx: {
                    pr: 1,
                  },
                }}
              />
              <Button
                variant="contained"
                color="primary"
                onClick={sendMessage}
                disabled={!userInput.trim() || isLoading}
                sx={{
                  minWidth: "auto",
                  width: 50,
                  height: 50,
                  borderRadius: "50%",
                }}
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