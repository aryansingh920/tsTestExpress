const express = require("express");
const nodemailer = require("nodemailer");
const axios = require("axios");

const app = express();
const port = 3000; // Update with your desired port number

// Configure Nodemailer
const transporter = nodemailer.createTransport({
  // Configure your email provider's SMTP settings here
  // Example for Gmail:
  service: "gmail",
  auth: {
    user: "your-email@example.com",
    pass: "your-password",
  },
});

// ChatGPT API endpoint and API key
const chatGptApiEndpoint =
  "https://api.openai.com/v1/engines/davinci-codex/completions";
const apiKey = "YOUR_API_KEY"; // Replace with your ChatGPT API key

// Endpoint to handle incoming email requests
app.post("/incoming-email", async (req, res) => {
  // Extract necessary information from the email request
  const { from, subject, text } = req.body;

  // Generate automatic response using ChatGPT API
  const response = await generateChatGptResponse(subject);

  // Prepare the email response
  const mailOptions = {
    from: "your-email@example.com",
    to: from,
    subject: "Auto Reply - Re: " + subject,
    text: response,
  };

  // Send the email response
  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.error("Error sending email:", error);
      res.status(500).send("Error sending email");
    } else {
      console.log("Email response sent:", info.response);
      res.status(200).send("Email response sent");
    }
  });
});

// Generate automatic response using ChatGPT API
async function generateChatGptResponse(subject) {
  try {
    const response = await axios.post(
      chatGptApiEndpoint,
      {
        prompt: `Subject: ${subject}\n\nMessage:`,
        max_tokens: 50, // Adjust the response length as needed
        temperature: 0.7, // Adjust the creativity level (0.0 - 1.0)
        n: 1,
      },
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${apiKey}`,
        },
      }
    );

    return response.data.choices[0].text.trim();
  } catch (error) {
    console.error("Error generating ChatGPT response:", error);
    return "Error generating response";
  }
}

// Start the server
app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});
