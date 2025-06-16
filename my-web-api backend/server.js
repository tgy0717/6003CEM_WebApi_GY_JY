require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const bcrypt = require("bcrypt");
const nodemailer = require("nodemailer");

const Movie = require("./Model/Movie");
const User = require("./Model/User");
const Booking = require("./Model/Booking");
const Favorite = require("./Model/Favorite");
// Payment API
const Stripe = require('stripe');
const stripe_key = Stripe(process.env.STRIPE_SECRET_KEY);

const app = express();
app.use(express.json());
app.use(cors());

// MongoDB Connection
mongoose.connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true
})
.then(() => console.log("MongoDB Connected"))
.catch(err => console.log(err));

// Arrays that used to store verification code
const verification_codes = {}

// Payment API
app.post('/api/create-checkout-session', async (req, res) => {
  const { movieId, movieTitle, price, userId, quantity, cinema, bookingDate } = req.body;

  try {
    const session = await stripe_key.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [{
        price_data: {
          currency: 'myr',
          product_data: {
            name: movieTitle,
            metadata: { movieId, userId, cinema, bookingDate, quantity: quantity.toString()},
          },
          unit_amount: Math.round(15 * 100),
        },
        quantity,
      }],
      mode: 'payment',
      success_url: `http://localhost:5173/paymentSuccess?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: 'http://localhost:5173/payment?canceled=true',
    });

    res.json({ id: session.id });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Start Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

// Sample Route
app.get("/api/movie", async (req, res) => {
        try {
                const movies = await Movie.find(); 
                res.json(movies); 
        } catch (err) {
                res.status(500).json({ message: err.message });
        }
});

function generateVerificationCode() {
    return Math.floor(100000 + Math.random() * 900000).toString(); // 6-digit
}

function storeVerificationCode(email, code) {
    verification_codes[email] = code;
}

function verifyStoredCode(email, userCode) {
    return verification_codes[email] === userCode;
}

// Send Verification Email
async function sendVerificationEmail(receiverEmail, receiverName) {
    const code = generateVerificationCode();
    storeVerificationCode(receiverEmail, code);

    const transporter = nodemailer.createTransport({
        // service: "gmail",
        // auth: {
        //     user: process.env.SENDER_EMAIL,
        //     pass: process.env.SMTP_PASSWORD,
        // },
        host: "smtp.gmail.com",
        port: 587, // Use TLS
        secure: false, // TLS requires this to be false
        auth: {
            user: process.env.SENDER_EMAIL,
            pass: process.env.SMTP_PASSWORD, // Must be an App Password if using 2FA
        },
    });

    const mailOptions = {
        from: `"Cinema App" <${process.env.SENDER_EMAIL}>`,
        to: receiverEmail,
        subject: "Cinema App - Password Reset Code",
        html: `
            <p>Hi ${receiverName},</p>
            <p>Your password reset code is: <strong>${code}</strong></p>
            <p>If you did not request this, please ignore this email.</p>
        `,
    };

    await transporter.sendMail(mailOptions);
}

// Forget password (Enter email)
app.post('/api/forgot-password', async (req, res) => {
    const { email } = req.body;

    if (!email) return res.status(400).json({ message: "Email is required." });

    try {
        const user = await User.findOne({ email });

        if (!user) return res.status(404).json({ message: "Email not found." });

        await sendVerificationEmail(user.email, user.username || user.email.split('@')[0]);

        return res.status(200).json({ message: "Verification email sent successfully." });
    } catch (error) {
        console.error("Forgot Password Error:", error);
        return res.status(500).json({ message: "Internal server error." });
    }
});

// Verify Code
app.post('/api/verify-code', async (req, res) => {
    const { email, code } = req.body;

    if (!code) return res.status(400).json({ message: "Verification code is required." });

    const storedCode = verification_codes[email];
    if (!storedCode) {
        return res.status(400).json({ message: "No verification code found. Please request a new one." });
    }

    if (!verifyStoredCode(email, code)) {
        return res.status(400).json({ message: "Invalid verification code." });
    }

    // Remove code after successful verification
    delete verification_codes[email];

    res.status(200).json({ message: "Verification successful. You may reset your password now." });
});

app.post('/api/reset-password', async (req, res) => {
    const { email, new_password, confirm_password } = req.body;

    if (!new_password || !confirm_password) {
        return res.status(400).json({ message: "New and confirm password are required." });
    }

    if (new_password !== confirm_password) {
        return res.status(400).json({ message: "Passwords do not match." });
    }

    try {
        const hashedPassword = await bcrypt.hash(new_password, 10);

        const user = await User.findOneAndUpdate(
            { email },
            { password: hashedPassword },
            { new: true }
        );

        if (!user) {
            return res.status(404).json({ message: "User not found." });
        }

        return res.status(200).json({ message: "Password changed successfully." });
    } catch (error) {
        console.error("Reset Password Error:", error);
        return res.status(500).json({ message: "Internal server error." });
    }
});


// Login
app.post("/api/login", async (req, res) => {
        const { email, password } = req.body;

        try {
                const user = await User.findOne({email});
                if(!user){
                        return res.status(404).json({ message: "User not found." });
                }

                const isPasswordValid = await bcrypt.compare(password, user.password);
                if(!isPasswordValid){
                        return res.status(404).json({ message: "Invalid password." });
                }

                res.status(200).json({ message: "Login successful", user: { id: user._id, username: user.username, email: user.email } });
        } catch (err) {
                res.status(500).json({ message: err.message });
        }
});

// Registration
app.post("/api/register", async(req, res) => {
        const { username, email, password } = req.body;

        try{
                const existingUser = await User.findOne({email});
                if(existingUser){
                        return res.status(400).json({message: "Email already exists."});
                }

                const hashedPassword = await bcrypt.hash(password, 10);
                const newUser = new User({username, email, password: hashedPassword});
                await newUser.save();

                res.status(201).json({message: "User registred successfully!"});
        }catch(err){
                res.status(500).json({message: err.message});
        }
});

// Save Booking
app.post('/api/verify-and-save-booking', async (req, res) => {
  const { sessionId } = req.body;

  try {
    // 1. Retrieve Stripe session (with expanded line_items)
//     console.log('[Debug] Fetching Stripe session...');
    const session = await stripe_key.checkout.sessions.retrieve(sessionId, {
      expand: ['line_items.data.price.product']
    });
//     console.log('[Debug] Stripe session retrieved:', JSON.stringify(session, null, 2));

    // 2. Validate payment status
    if (session.payment_status !== 'paid') {
      console.error('[Error] Payment not completed for session:', sessionId);
      return res.status(400).json({ error: 'Payment not completed' });
    }

    // 3. Safely extract metadata
//     console.log('[Debug] Extracting line items...');
    const lineItem = session.line_items?.data?.[0];
    if (!lineItem) {
      console.error('[Error] No line items found in session:', sessionId);
      return res.status(400).json({ error: 'No line items found' });
    }

//     console.log('[Debug] Extracting product metadata...');
    const productMetadata = lineItem.price?.product?.metadata;
    if (!productMetadata) {
      console.error('[Error] Product metadata missing in line item:', lineItem);
      return res.status(400).json({ error: 'Product metadata missing' });
    }

    const { 
      movieId, 
      userId, 
      cinema, 
      bookingDate, 
      quantity 
    } = productMetadata;
//     console.log('[Debug] Extracted metadata:', { movieId, userId, cinema, bookingDate, quantity });

    // 4. Save booking to database
    console.log('[Debug] Creating booking record...');
    const newBooking = new Booking({
      movieId,
      userId,
      cinema,
      bookingDate,
      quantity,
      total: session.amount_total / 100,
      paymentStatus: 'paid',
      sessionId,
    });

    const savedBooking = await newBooking.save();
//     console.log('[Success] Booking saved:', savedBooking);
    res.status(201).json({ message: 'Booking saved successfully', booking: savedBooking });

  } catch (error) {
    console.error('[Critical Error] Failed to save booking:', {
      errorMessage: error.message,
      errorStack: error.stack,
      sessionId,
      timestamp: new Date().toISOString()
    });
    res.status(500).json({ 
      message: 'Server error saving booking',
      error: error.message 
    });
  }
});

app.put("/api/users/:id", async (req, res) => {
  
  console.log("Received profile update:", req.body);
  const { username, email } = req.body;

  try {
    const user = await User.findByIdAndUpdate(
      req.params.id,
      { username, email },
      { new: true }
    );
    if (!user) return res.status(404).json({ message: "User not found." });
    console.log(user)
    res.json({ message: "Profile updated successfully!", user: { id: user._id, username: user.username, email: user.email } });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

app.put("/api/users/:id/password", async (req, res) => {
  const { oldPassword, newPassword, confirmPassword } = req.body;

  try {
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ message: "User not found." });

    const isMatch = await bcrypt.compare(oldPassword, user.password);
    if (!isMatch) return res.status(400).json({ message: "Old password is incorrect." });

    if (newPassword !== confirmPassword) {
      return res.status(400).json({ message: "Passwords do not match." });
    }

    user.password = await bcrypt.hash(newPassword, 10);
    await user.save();

    res.json({ message: "Password changed successfully!" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Get booking
app.get('/api/get-booking', async (req, res) => {
  const { userId } = req.query;

  console.log("User ID:", userId);

  try {
    if(!userId) {
      return res.status(400).json({message: "Missing user ID parameter."});
    }

    const bookings = await Booking.find({ userId }).sort({ createdAt: -1 });

    console.log("Bookings:", bookings);

    res.status(200).json(bookings);
  } catch(error) {
    res.status(500).json({message: "Failed to retrieve bookings", error: error.message});
  }

});

app.post('/api/toggle-favorite', async (req, res) => {
  const { userId, movieId } = req.body;

  try {
    const exists = await Favorite.findOne({ userId, movieId });

    if (exists) {
      await Favorite.deleteOne({ userId, movieId });
      return res.status(200).json({ message: 'Favorite removed' });
    } else {
      const newFavorite = new Favorite({ userId, movieId });
      await newFavorite.save();
      return res.status(201).json({ message: 'Favorite added' });
    }
  } catch (err) {
    console.error('Error toggling favorite:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

app.get('/api/is-favorite', async (req, res) => {
  const { userId, movieId } = req.query;

  try {
    const exists = await Favorite.findOne({ userId, movieId });
    res.json({ isFavorite: !!exists });
  } catch (err) {
    console.error('Error checking favorite:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

app.get('/api/get-favorites', async (req, res) => {
  const { userId } = req.query;

  if (!userId) {
    return res.status(400).json({ message: 'Missing userId' });
  }

  try {
    const favorites = await Favorite.find({ userId });

    // Return just the movieId list
    const result = favorites.map(fav => fav.movieId);

    res.status(200).json(result);
  } catch (error) {
    console.error('Error fetching favorites:', error);
    res.status(500).json({ message: 'Server error' });
  }
});
