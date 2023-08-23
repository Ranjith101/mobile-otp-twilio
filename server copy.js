const express = require('express');
const bodyParser = require('body-parser');
const twilio = require('twilio');

const app = express();
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// Twilio API credentials
const sid = 'ACfde5b4cc6a42b508370b9f3703d10179';
const auth_token = 'af75dbd87f344d0bdc712c37076acfce';
const fromPhoneNumber = '+12518505863';

const client = twilio(sid, auth_token);

// Function to generate a random 6-digit OTP
function generateOTP() {
  return Math.floor(100000 + Math.random() * 900000);
}

// Endpoint to send OTP to a phone number
app.post('/send-otp', (req, res) => {
  const userPhoneNumber = req.body.userPhoneNumber;

  // Generate an OTP
  const otp = generateOTP();

  // Send the OTP via SMS
  client.messages
    .create({
      from: fromPhoneNumber,
      to: userPhoneNumber,
      body: `Your OTP is: ${otp}`,
    })
    .then(() => {
      console.log(`OTP sent to ${userPhoneNumber}`);
      res.status(200).json({ message: 'OTP sent successfully' });
    })
    .catch((error) => {
      console.error(error);
      res.status(500).json({ message: 'Failed to send OTP' });
    });
});

// Start the server
const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
