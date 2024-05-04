// Import required modules
const express = require('express'); // Express framework for web applications
const mongoose = require('mongoose'); // MongoDB object modeling tool
const bodyParser = require('body-parser'); // Parse incoming request bodies
const bcrypt = require('bcryptjs'); // Library for hashing passwords
const jwt = require('jsonwebtoken'); // JSON Web Token implementation

const app = express(); // Create Express application

// Connect to MongoDB database
mongoose.connect('mongodb://localhost:27017/dispensary', { //MongoDB connection string and 'secret' JWT secret key
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useCreateIndex: true
})
.then(() => console.log('MongoDB connected')) // Log successful connection
.catch(err => console.log(err)); // Log any errors during connection

// Import User model
const User = require('./models/User'); // Require the User model defined in a separate file

// Middleware setup
app.use(bodyParser.json()); // Parse incoming request bodies in JSON format

// Registration route
app.post('/register', async (req, res) => {
  try {
    const { firstName, lastName, mobileNumber, email, password } = req.body; // Extract user data from request body

    // Check if user already exists in the database
    let user = await User.findOne({ email });
    if (user) {
      return res.status(400).json({ message: 'User already exists' }); // Return error if user already exists
    }

    // Hash the password before storing it in the database
    const salt = await bcrypt.genSalt(10); // Generate a salt for password hashing
    const hashedPassword = await bcrypt.hash(password, salt); // Hash the password

    // Create a new user instance with the hashed password
    user = new User({
      firstName,
      lastName,
      mobileNumber,
      email,
      password: hashedPassword
    });

    await user.save(); // Save the user to the database

    res.json({ message: 'User registered successfully' }); // Return success message
  } catch (err) {
    console.error(err.message); // Log any errors
    res.status(500).send('Server Error'); // Return server error message
  }
});

// Login route
app.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body; // Extract email and password from request body

    // Check if user exists in the database
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: 'Invalid credentials' }); // Return error if user does not exist
    }

    // Check if password matches
    const isMatch = await bcrypt.compare(password, user.password); // Compare hashed password with input password
    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid credentials' }); // Return error if passwords don't match
    }

    // Create and return JWT token if login is successful
    const payload = {
      user: {
        id: user._id
      }
    };

    jwt.sign(payload, 'secret', { expiresIn: '1h' }, (err, token) => { // Create JWT token with expiration time of 1 hour
      if (err) throw err; // Throw error if JWT token creation fails
      res.json({ token }); // Return JWT token
    });
  } catch (err) {
    console.error(err.message); // Log any errors
    res.status(500).send('Server Error'); // Return server error message
  }
});

const PORT = process.env.PORT || 5000; // Set port for the server to listen on

app.listen(PORT, () => console.log(`Server started on port ${PORT}`)); // Start the server and log the port
