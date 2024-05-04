const mongoose = require('mongoose'); // Import Mongoose for MongoDB object modeling

// Define the user schema
const UserSchema = new mongoose.Schema({
  // First name of the user
  firstName: {
    type: String,
    required: true // Field is required
  },
  // Last name of the user
  lastName: {
    type: String,
    required: true // Field is required
  },
  // Mobile number of the user
  mobileNumber: {
    type: String,
    required: true // Field is required
  },
  // Email of the user
  email: {
    type: String,
    required: true, // Field is required
    unique: true // Ensure email is unique
  },
  // Password of the user
  password: {
    type: String,
    required: true // Field is required
  },
  // Date when the user document was created
  date: {
    type: Date,
    default: Date.now // Default value is the current date and time
  }
});

// Create User model using the schema
module.exports = User = mongoose.model('user', UserSchema);
