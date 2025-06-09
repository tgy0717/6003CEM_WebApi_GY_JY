require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const bcrypt = require("bcrypt");
const Movie = require("./Model/Movie");
const User = require("./Model/User");
const Booking = require("./Model/Booking");

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
// app.post('/api/verify-and-save-booking', async (req, res) => {
//   const { sessionId } = req.body;
//   try {
//     // 1. Retrieve Stripe session
//     const session = await stripe_key.checkout.sessions.retrieve(sessionId);

//     // 2. Validate payment status
//     if(session.payment_status !== 'paid') {
//         return res.status(400).json({ error: 'Payment not completed'});
//     }

//     // 3. Extract metadata from the session
//     const { movieId, userId, cinema, bookingDate, quantity} = session.line_items.data[0].price_data.product_data.metadata;

//     // 4. Create and save booking
//     const newBooking = new Booking({
//       movieId,
//       userId,
//       cinema,
//       bookingDate,
//       quantity,
//       total: session.amount_total / 100,
//       paymentStatus: 'paid',
//       sessionId: sessionId,
//       bookingCreatedTime: new Date(),
//     });

//     const savedBooking = await newBooking.save();

//     res.status(201).json({ message: 'Booking saved successfully', booking: savedBooking });
//   } catch (error) {
//     console.error('Error saving booking:', error);
//     print("Error:", error);
//     res.status(500).json({ message: 'Server error saving booking' });
//   }
// });

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


