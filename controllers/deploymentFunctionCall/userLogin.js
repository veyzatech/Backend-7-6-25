import userInformation from "../../models/Production/userInformation.js";
import { generateTokenAndSetCookie } from "../../lib/token.js";

//signup
async function signup(req, res) {
  try {
    const { userName, userEmailID, password, authKey, assignedRole } = req.body;

    // Validate password match
    // if (password !== confirmPassword) {
    //   return res.status(400).json({ error: "Passwords don't match" });
    // }

    // Check if username already exists
    const existingUser = await userInformation.findOne({ userEmailID });
    if (existingUser) {
      return res.status(400).json({ error: "Username already exists" });
    }

    // Hash the password
    // const salt = await bcrypt.genSalt(10);
    // const hashedPassword = await bcrypt.hash(password, salt);

    // Set profile picture based on gender
    // const profilePic = `https://avatar.iran.liara.run/username?username=${username}`;

    // Create and save new user
    const userArray = [];
    const visibleVechile = [];
    const newUser = new userInformation({
      userName,
      userArray,
      userEmailID,
      password,
      authKey,
      assignedRole,
      visibleVechile,
    });

    await newUser.save();

    // Generate token and set cookie
    generateTokenAndSetCookie(newUser._id, res);

    res.status(201).json({
      message: "User registered successfully",
      user: {
        _id: newUser._id,
        fullName: newUser.userName,
        EmailID: newUser.userEmailID,
        Role: newUser.assignedRole,
      },
    });
  } catch (error) {
    console.error("Error during signup:", error.message);
    res.status(500).json({ error: "Internal Server Error" });
  }
}

// Login route
async function login(req, res) {
  try {
    const { userEmailID, password } = req.body;
    const newUser = await userInformation.findOne({ userEmailID: userEmailID });

    if (!newUser || newUser.password !== password) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    generateTokenAndSetCookie(newUser._id, res);

    res.status(200).json({
      message: "Login successful",
      user: {
        _id: newUser._id,
        fullName: newUser.userName,
        EmailID: newUser.userEmailID,
        Role: newUser.assignedRole,
      },
    });
  } catch (error) {
    console.error("Error logging in try again:", error.message, error.stack);
    return { message: "An error occurred while logging." };
  }
}

// Logout

async function logout(req, res) {
  try {
    await res.clearCookie("Veyza", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "Strict",
    });

    res.status(200).json({ message: "Logged out successfully" });
  } catch (error) {
    console.error("Error during logout:", error.message);
    res.status(500).json({ error: "Internal Server Error" });
  }
}
export { login, logout, signup };
