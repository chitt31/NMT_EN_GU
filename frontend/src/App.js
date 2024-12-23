import React, { useState } from "react";
import { Container, TextField, Button, Typography, Box, CircularProgress } from "@mui/material";
import "./App.css";

function App() {
  const [englishText, setEnglishText] = useState("");
  const [gujaratiText, setGujaratiText] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const translateText = async () => {
    setLoading(true);  // Show loading indicator
    setError("");      // Clear any previous error

    try {
      const response = await fetch("http://localhost:5000/translate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ text: englishText }),
      });

      const data = await response.json();

      if (response.ok) {
        setGujaratiText(data.translated_text);  // Corrected key "translated_text"
      } else {
        setError(data.error || "Translation failed");
      }
    } catch (error) {
      setError("Error communicating with the server");
    } finally {
      setLoading(false);  // Hide loading indicator
    }
  };

  return (
    <Container maxWidth="sm" sx={{ textAlign: "center", paddingTop: 5 }}>
      <Typography variant="h3" gutterBottom color="primary">
        English to Gujarati Translator
      </Typography>
      
      <TextField
        label="Enter English text"
        variant="outlined"
        fullWidth
        multiline
        rows={6}
        value={englishText}
        onChange={(e) => setEnglishText(e.target.value)}
        sx={{ marginBottom: 3 }}
      />
      
      <Button
        variant="contained"
        color="primary"
        onClick={translateText}
        fullWidth
        disabled={loading}
        sx={{ marginBottom: 3 }}
      >
        {loading ? <CircularProgress size={24} color="secondary" /> : "Translate"}
      </Button>
      
      {error && (
        <Typography variant="body1" color="error" sx={{ marginBottom: 3 }}>
          {error}
        </Typography>
      )}
      
      <Typography variant="h6" gutterBottom color="secondary">
        Translation:
      </Typography>
      
      <TextField
        label="Gujarati translation"
        variant="outlined"
        fullWidth
        multiline
        rows={6}
        value={gujaratiText}
        InputProps={{
          readOnly: true,
        }}
      />
    </Container>
  );
}

export default App;
