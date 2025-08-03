require("dotenv").config(); // Ensure this is at the top of your file

const express = require("express");
const app = express();
const port = 8000;
const cors = require("cors");
const connectDB = require("./db/dbConnection");
const Post = require("./db/post");
const multer = require("multer");
const path = require("path");
const User = require("./db/user");
const bcrypt = require("bcrypt");
const { generateToken, verifyToken } = require("./utils/jwt");

const jwtSecret = process.env.JWT_SECRET;

// Middleware
app.use(express.json());
app.use(cors());

// Multer setup for storing profile pictures and other files on disk
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    if (file.fieldname === "profilePicture") {
      cb(null, "uploads/profile-pictures/"); // Save profile pictures in a separate folder
    } else {
      cb(null, "uploads/"); // Save other files here
    }
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + "-" + file.originalname); // Ensure unique filenames
  },
});
const upload = multer({ storage: storage });

// Create post route
app.post(
  "/Create",
  verifyToken,
  upload.fields([{ name: "photo" }, { name: "video" }]),
  async (req, res) => {
    console.log("Request Body:", req.body);
    console.log("Files:", req.files);
    try {
      const { title, discription } = req.body;
      const photo = req.files["photo"] ? req.files["photo"][0].path : "";
      const video = req.files["video"] ? req.files["video"][0].path : "";

      // Create a new post associated with the logged-in user
      const post = new Post({
        title,
        discription,
        photo,
        video,
        user: req.user.id,
      });

      await post.save();

      res
        .status(201)
        .json({ success: true, message: "Post created successfully" });
    } catch (error) {
      console.error(error);
      res
        .status(500)
        .json({
          success: false,
          message: "An error occurred while creating the post",
        });
    }
  }
);

// Registration route
app.post("/registration", async (req, res) => {
  try {
    const { username, email, password, gender } = req.body;

    const existingUser = await User.findOne({ username });
    const existingEmail = await User.findOne({ email });

    if (existingUser) {
      return res.json({
        success: "user",
        message: "Username already registered",
      });
    } else if (existingEmail) {
      return res.json({
        success: "email",
        message: "Email already registered",
      });
    }

    const user = new User({ username, email, password, gender });
    await user.save(); // Password will be hashed by the pre('save') hook in the schema
    console.log("Saved User:", user);

    const token = generateToken(user);
    res
      .status(201)
      .json({ success: true, message: "Registration successful", token });
  } catch (error) {
    console.error("Error during registration:", error);
    res.status(500).json({ error: "Registration failed" });
  }
});

// Login route
app.post("/login", async (req, res) => {
  console.log("Login Attempt:", req.body);
  try {
    let { username, password } = req.body;

    // Convert the username to lowercase
    username = username.toLowerCase();

    // Find the user with a case-insensitive search
    const user = await User.findOne({
      username: { $regex: new RegExp("^" + username + "$", "i") },
    });

    if (!user) {
      return res.json({
        success: false,
        message: "Invalid username or password",
      });
    }

    // Compare entered password with hashed password
    const isMatch = await bcrypt.compare(password, user.password);
    console.log("Password Match:", isMatch); // Log whether passwords match

    if (!isMatch) {
      return res.json({
        success: false,
        message: "Invalid username or password",
      });
    }

    // Generate token and send response
    const token = generateToken(user);
    res.json({ success: true, message: "Login successful", token });
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({ error: "Login failed due to server error" });
  }
});

// Profile picture upload route
app.post(
  "/profile-picture",
  verifyToken,
  upload.single("profilePicture"),
  async (req, res) => {
    try {
      const user = await User.findById(req.user.id);
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }

      // Save the profile picture path
      user.profilePicture = req.file.path.replace(/\\/g, "/"); // Ensure file path uses forward slashes
      await user.save();

      res
        .status(200)
        .json({
          success: true,
          message: "Profile picture updated successfully",
          profilePicture: user.profilePicture,
        });
    } catch (error) {
      console.error("Error uploading profile picture:", error);
      res
        .status(500)
        .json({
          message: "An error occurred while uploading the profile picture",
        });
    }
  }
);

app.get("/profile-picture", verifyToken, async (req, res) => {
  try {
    // Find the user by their ID, since req.user.id contains the logged-in user's ID
    const user = await User.findOne({ _id: req.user.id });

    if (!user || !user.profilePicture) {
      return res.status(404).json({ message: "Profile picture not found" });
    }

    // Return the profile picture path
    res.status(200).json({ profilePicture: user.profilePicture });
  } catch (error) {
    console.error("Error fetching profile picture:", error);
    res.status(500).json({ message: "Server error" });
  }
});

app.get("/username", verifyToken, async (req, res) => {
  const user = await User.findOne({ _id: req.user.id });
  res.status(200).json({ username: user.username });
});

// Gathering posts for Profile
app.get("/Profile", verifyToken, async (req, res) => {
  try {
    const userPosts = await Post.find({ user: req.user.id });
    res.status(200).json(userPosts);
  } catch (error) {
    res.status(500).json({ message: "Error retrieving posts" });
  }
});

// Get all posts with optional search functionality
app.get("/", async (req, res) => {
  try {
    const { search } = req.query;
    const query = search ? { title: { $regex: search, $options: "i" } } : {};

    // Populate both the post's user and each comment's user with their profile picture and username
    const userPosts = await Post.find(query)
      .populate("user", "username profilePicture") // Populate user info for the post
      .populate("comments.user", "username profilePicture") // Populate user info for the comments
      .select("title discription photo video comments likes liked user");

    res.status(200).json(userPosts);
  } catch (error) {
    res.status(500).json({ message: "Error retrieving posts" });
  }
});

// Add comment to a post
// Add comment to a post
app.post("/post/:id/comment", verifyToken, async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }

    // Add the comment with current timestamp
    const newComment = {
      user: req.user.id,
      text: req.body.text,
      createdAt: new Date() // Explicitly set the timestamp
    };

    post.comments.push(newComment);
    await post.save();

    // Populate the post with user information and return it
    const populatedPost = await Post.findById(req.params.id)
      .populate("user", "username profilePicture")
      .populate("comments.user", "username profilePicture");

    res.status(200).json(populatedPost);
  } catch (error) {
    res.status(500).json({ message: "Error adding comment" });
  }
});


// Like/Unlike a post
app.post("/post/:id/like", verifyToken, async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }

    const userId = req.user.id;
    const hasLiked = post.liked.includes(userId);

    if (hasLiked) {
      // User is unliking the post
      post.likes = Math.max(0, post.likes - 1);
      post.liked = post.liked.filter(
        (id) => id.toString() !== userId.toString()
      );
    } else {
      // User is liking the post
      post.likes += 1;
      post.liked.push(userId);
    }

    await post.save();

    res.status(200).json({ likes: post.likes, liked: !hasLiked });
  } catch (error) {
    res.status(500).json({ message: "Error liking post", error });
  }
});

// Serve static files from the 'uploads' directory
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// Connect to the database
connectDB();

app.listen(port, () => {
  console.log(`Server is listening on port ${port}`);
});
