import React from "react";
import {
  Container,
  Typography,
  Box,
  Paper,
  Divider,
  Card,
  CardContent,
  Grid,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Chip,
  useTheme,
  createTheme,
  ThemeProvider,
  alpha,
} from "@mui/material";
import {
  Security,
  PrivacyTip,
  DataUsage,
  Share,
  Cookie,
  AccountCircle,
  Update,
  Email,
  Info,
  CheckCircle,
} from "@mui/icons-material";

// Custom theme for privacy policy page
const theme = createTheme({
  palette: {
    primary: {
      main: "#2e7d32", // Green for solar/eco theme
      light: "#60ad5e",
      dark: "#005005",
    },
    secondary: {
      main: "#1976d2", // Blue for trust/security
      light: "#63a4ff",
      dark: "#004ba0",
    },
    background: {
      default: "#f8f9fa",
      paper: "#ffffff",
    },
  },
  typography: {
    fontFamily: "'Roboto', 'Segoe UI', sans-serif",
    h3: {
      fontWeight: 700,
      letterSpacing: "-0.5px",
    },
    h4: {
      fontWeight: 700,
      letterSpacing: "-0.5px",
    },
    h5: {
      fontWeight: 600,
    },
    h6: {
      fontWeight: 600,
    },
  },
  components: {
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 12,
          boxShadow: "0 4px 20px rgba(0,0,0,0.08)",
        },
      },
    },
    MuiDivider: {
      styleOverrides: {
        root: {
          margin: "24px 0",
        },
      },
    },
    MuiListItem: {
      styleOverrides: {
        root: {
          paddingLeft: 0,
        },
      },
    },
  },
});

const PrivacyPolicy = () => {
  const currentTheme = useTheme();

  const sections = [
    {
      id: "information",
      title: "Information We Collect",
      icon: <DataUsage color="primary" />,
      content: [
        "Personal details (name, email, phone) provided during registration or contact.",
        "Solar input data, location, and preferences submitted by users.",
        "Technical information like IP address, browser type, and device info.",
      ],
    },
    {
      id: "usage",
      title: "How We Use Your Information",
      icon: <Info color="primary" />,
      content: [
        "To provide solar monitoring and forecasting services.",
        "To process membership and payments securely.",
        "To respond to inquiries, feedback, or support requests.",
        "To send important updates or service-related communication.",
      ],
    },
    {
      id: "sharing",
      title: "Data Sharing",
      icon: <Share color="primary" />,
      content: [
        "We do not sell or rent your personal information. Data may be shared with trusted partners only to support essential services (e.g., payment gateways, email services).",
      ],
    },
    {
      id: "security",
      title: "Data Security",
      icon: <Security color="primary" />,
      content: [
        "We implement strong security measures to safeguard your data from unauthorized access, disclosure, or misuse.",
      ],
    },
    {
      id: "cookies",
      title: "Cookies and Tracking",
      icon: <Cookie color="primary" />,
      content: [
        "Our website may use cookies to improve your experience, track usage, and remember your preferences.",
      ],
    },
    {
      id: "rights",
      title: "Your Rights",
      icon: <AccountCircle color="primary" />,
      content: [
        "You have the right to access, correct, or delete your data at any time. Contact us at solarnexusofficial@gmail.com for any requests.",
      ],
    },
    {
      id: "updates",
      title: "Updates to This Policy",
      icon: <Update color="primary" />,
      content: [
        "We may update this policy from time to time. Changes will be reflected on this page with a revised \"Last Updated\" date."
      ],
    },
    {
      id: "contact",
      title: "Contact Us",
      icon: <Email color="primary" />,
      content: [
        "If you have any questions about this Privacy Policy, reach out to us at solarnexusofficial@gmail.com.",
      ],
    },
  ];

  return (
    <ThemeProvider theme={theme}>
      <Box
        sx={{
          bgcolor: "background.default",
          minHeight: "100vh",
          py: 6,
        }}
      >
        <Container maxWidth="md">
          <Paper
            elevation={0}
            sx={{
              p: { xs: 3, md: 5 },
              borderRadius: 3,
              bgcolor: "background.paper",
              border: "1px solid",
              borderColor: "divider",
            }}
          >
            <Box sx={{ textAlign: "center", mb: 4 }}>
              <Chip
                label="Official Document"
                color="primary"
                size="small"
                sx={{ mb: 2 }}
              />
              <Typography variant="h3" gutterBottom color="primary.dark">
                Privacy Policy
              </Typography>
              <Divider
                sx={{
                  width: "80px",
                  mx: "auto",
                  borderWidth: 2,
                  borderColor: "primary.main",
                  my: 3,
                }}
              />
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  mb: 2,
                }}
              >
                <PrivacyTip
                  color="primary"
                  sx={{ fontSize: 28, mr: 1 }}
                />
                <Typography variant="h6" color="text.secondary">
                  Your Privacy Matters to Us
                </Typography>
              </Box>
            </Box>

            <Card
              sx={{
                mb: 5,
                bgcolor: alpha(currentTheme.palette.primary.main, 0.05),
                border: "1px solid",
                borderColor: alpha(currentTheme.palette.primary.main, 0.1),
              }}
            >
              <CardContent sx={{ p: 3 }}>
                <Typography variant="body1" paragraph sx={{ fontSize: "1.1rem" }}>
                  At <strong>Solar Nexus</strong>, we are committed to protecting your privacy and ensuring the security of your personal information. This Privacy Policy outlines how we collect, use, and protect your data when you interact with our platform.
                </Typography>
              </CardContent>
            </Card>

            <Grid container spacing={4}>
              {sections.map((section, index) => (
                <Grid item xs={12} key={section.id}>
                  <Box
                    sx={{
                      display: "flex",
                      alignItems: "flex-start",
                      gap: 2,
                      p: 3,
                      borderRadius: 2,
                      bgcolor: index % 2 === 0 ? alpha(currentTheme.palette.primary.main, 0.03) : "transparent",
                      border: index % 2 === 0 ? "1px solid" : "none",
                      borderColor: alpha(currentTheme.palette.primary.main, 0.08),
                    }}
                  >
                    <Box
                      sx={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        width: 48,
                        height: 48,
                        borderRadius: "50%",
                        bgcolor: alpha(currentTheme.palette.primary.main, 0.1),
                        flexShrink: 0,
                      }}
                    >
                      {section.icon}
                    </Box>
                    <Box sx={{ flex: 1 }}>
                      <Typography
                        variant="h5"
                        gutterBottom
                        color="primary.dark"
                        sx={{ display: "flex", alignItems: "center" }}
                      >
                        {index + 1}. {section.title}
                      </Typography>
                      <List disablePadding>
                        {section.content.map((item, i) => (
                          <ListItem key={i} alignItems="flex-start" sx={{ py: 0.5 }}>
                            <ListItemIcon sx={{ minWidth: 28 }}>
                              <CheckCircle
                                fontSize="small"
                                color="primary"
                                sx={{ fontSize: 16 }}
                              />
                            </ListItemIcon>
                            <ListItemText
                              primary={
                                <Typography variant="body1" color="text.primary">
                                  {item}
                                </Typography>
                              }
                            />
                          </ListItem>
                        ))}
                      </List>
                    </Box>
                  </Box>
                </Grid>
              ))}
            </Grid>

            <Divider sx={{ my: 4 }} />

            <Box
              sx={{
                display: "flex",
                flexDirection: { xs: "column", sm: "row" },
                justifyContent: "space-between",
                alignItems: { xs: "flex-start", sm: "center" },
                bgcolor: alpha(currentTheme.palette.secondary.main, 0.05),
                p: 3,
                borderRadius: 2,
                border: "1px solid",
                borderColor: alpha(currentTheme.palette.secondary.main, 0.1),
              }}
            >
              <Typography variant="body2" sx={{ fontStyle: "italic" }}>
                Last Updated: {new Date().toLocaleDateString()}
              </Typography>
              <Chip
                label="Solar Nexus Official"
                color="secondary"
                size="small"
                sx={{ mt: { xs: 2, sm: 0 } }}
              />
            </Box>
          </Paper>
        </Container>
      </Box>
    </ThemeProvider>
  );
};

export default PrivacyPolicy;