const mongoose = require("mongoose");
const bcrypt = require("bcrypt"); // Used to hash the password

const UserSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  gender: {
    type: String,
    required: true,
  },
  profilePicture: {
    type: String, // URL or file path to the profile picture
    default: "uploads/profile-pictures/download.png", // Default image path
  },
});

// Pre-save middleware to hash the password before saving
UserSchema.pre("save", async function (next) {
  const user = this;

  // Only hash the password if it has been modified or is new
  if (!user.isModified("password")) {
    return next();
  }

  try {
    // Hash the password using bcrypt
    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(user.password, salt);
    next();
  } catch (err) {
    next(err);
  }
});

// Method to compare provided password with the hashed password
UserSchema.methods.comparePassword = async function (candidatePassword) {
  return bcrypt.compare(candidatePassword, this.password);
};

// Creating a model from the schema
const User = mongoose.model("User", UserSchema);

module.exports = User;
