require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const bcrypt = require("bcrypt");
const Movie = require("./Model/Movie");
const User = require("./Model/User");


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
app.get("/api/login", async (req, res) => {

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


