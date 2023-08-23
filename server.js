const express = require('express');
const bodyParser = require('body-parser');
const twilio = require('twilio');
const otpStore = new Map();

const app = express();
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// Twilio API credentials
const sid ='';
const auth_token = '';
const fromPhoneNumber = '';

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

  // Inside the '/send-otp' endpoint
otpStore.set(userPhoneNumber, otp);
console.log(`OTP stored for ${userPhoneNumber}: ${otp}`);

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

// Endpoint to verify OTP
app.post('/verify-otp', (req, res) => {
    const userPhoneNumber = req.body.userPhoneNumber;
    const userEnteredOTP = req.body.userEnteredOTP; // OTP entered by the user
  
    // Retrieve the stored OTP for the given phone number
    const storedOTP = otpStore.get(userPhoneNumber);
    console.log(storedOTP)
    if (!storedOTP) {
      // No OTP found for the provided phone number or OTP expired
      res.status(400).json({ message: 'OTP not found or expired' });
    } else if (userEnteredOTP === storedOTP.toString()) {
      // OTP is valid
      otpStore.delete(userPhoneNumber); // Remove the used OTP from storage
      res.status(200).json({ message: 'OTP verification successful' });
    } else {
      // OTP is invalid
      res.status(400).json({ message: 'Invalid OTP' });
    }
  });
  

// Start the server
const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
