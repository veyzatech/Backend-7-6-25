import bcrypt from "bcryptjs"; // For password hashing
import jwt from "jsonwebtoken"; // For JWT token generation
import Account from "../../models/Core/Account.js";
import User from "../../models/Core/User.js";
import { v4 as uuidv4 } from "uuid";

// Function to create a new account --working
export const createAccount = async (req, res) => {
  const { accountData, userData } = req.body;

  try {
    // Step 1: Create the User first
    const accountOwner = new User({
      name: userData.name,
      email: userData.email,
      password: await bcrypt.hash(userData.password, 10), // Hash the password
      phone: userData.phone,
      role: "Admin", // Default role for the account owner
      status: "Active", // Set status to Active for the new user
      account_id: null, // Temporarily set to null, will be updated later
    });

    // Save the User first
    const savedUser = await accountOwner.save();

    // Step 2: Now, create the Account and associate it with the User
    const newAccount = new Account({
      account_name: accountData.account_name,
      account_type: accountData.account_type,
      status: accountData.status,
      subscription_plan: accountData.subscription_plan,
      primary_contact_name: accountData.primary_contact_name,
      primary_contact_email: accountData.primary_contact_email,
      primary_contact_phone: accountData.primary_contact_phone,
      account_owner_id: savedUser._id, // Link to the User's ObjectId
      account_owner_uuid: uuidv4(), // Generate a UUID for the account owner if needed
    });

    // Save the Account
    const savedAccount = await newAccount.save();

    // Step 3: Update the user with the account_id
    savedUser.account_id = savedAccount._id; // Set the account_id in the user
    await savedUser.save(); // Save the updated user

    // Return success response with account data
    res
      .status(201)
      .json({ message: "Account created successfully", account: savedAccount });
  } catch (error) {
    res
      .status(500)
      .json({ message: `Error creating account: ${error.message}` });
  }
};
// Function to get account details by account_id
export const getAccountById = async (req, res) => {
  const { accountId } = req.params;
  try {
    const account = await Account.findById(accountId).populate(
      "sub_users.user_id"
    ); // Populate the sub-users and user data
    if (!account) {
      return res.status(404).json({ message: "Account not found" });
    }

    // Send the account data to the client
    res.status(200).json(account);
  } catch (error) {
    res
      .status(500)
      .json({ message: `Error fetching account: ${error.message}` });
  }
};

// Function to update an account
export const updateAccount = async (req, res) => {
  const { accountId } = req.params;
  const updatedData = req.body;

  try {
    const account = await Account.findById(accountId);
    if (!account) {
      return res.status(404).json({ message: "Account not found" });
    }

    // Update account details
    account.account_name = updatedData.account_name || account.account_name;
    account.account_type = updatedData.account_type || account.account_type;
    account.status = updatedData.status || account.status;
    account.subscription_plan =
      updatedData.subscription_plan || account.subscription_plan;
    account.primary_contact_email =
      updatedData.primary_contact_email || account.primary_contact_email;
    account.primary_contact_phone =
      updatedData.primary_contact_phone || account.primary_contact_phone;

    // Save updated account to the database
    const updatedAccount = await account.save();

    // Send response to the client
    res.status(200).json(updatedAccount);
  } catch (error) {
    res
      .status(500)
      .json({ message: `Error updating account: ${error.message}` });
  }
};

// Function to delete an account
export const deleteAccount = async (req, res) => {
  const { accountId } = req.params;
  const { role } = req.user; // AccountId and role are now part of req.user

  // Log accountId and role to verify they're coming from the JWT correctly

  // Check if the logged-in user is an admin
  if (role !== "Admin") {
    return res
      .status(403)
      .json({ message: "Forbidden: Only admins can delete account" });
  }
  try {
    const account = await Account.findById(accountId);
    if (!account) {
      return res.status(404).json({ message: "Account not found" });
    }

    // Delete all associated users
    await User.deleteMany({ account_id: accountId });

    // Delete the account
    await account.deleteOne();

    // Send success message to the client
    res.status(200).json({ message: "Account deleted successfully" });
  } catch (error) {
    res
      .status(500)
      .json({ message: `Error deleting account: ${error.message}` });
  }
};

// Function to add a sub-user to an account --working
export const addUser = async (req, res) => {
  try {
    // Extract the accountId and role from the authenticated user (from JWT)
    const { accountId, role } = req.user; // AccountId and role are now part of req.user

    // Log accountId and role to verify they're coming from the JWT correctly

    // Check if the logged-in user is an admin
    if (role !== "Admin") {
      return res
        .status(403)
        .json({ message: "Forbidden: Only admins can add users" });
    }

    // Validate required fields
    const { name, email, password, phone } = req.body;
    if (!name || !email || !password || !phone) {
      return res.status(400).json({ message: "All fields are required" });
    }

    // Check if account exists using the extracted accountId
    const account = await Account.findById(accountId);
    console.log("Account found:", account); // Log the account to see what is returned

    if (!account) {
      return res.status(404).json({ message: "Account not found" });
    }

    // Check if email is already in use
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "Email is already registered" });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create new user
    const newUser = new User({
      account_id: accountId, // Use accountId from JWT
      name,
      email,
      password: hashedPassword,
      phone,
    });

    // Save the user
    await newUser.save();

    // Add the user to the account's sub_users array
    account.sub_users.push({
      user_id: newUser._id,
      assigned_vehicles: [],
    });

    await account.save();

    return res
      .status(201)
      .json({ message: "User added successfully", user: newUser });
  } catch (error) {
    console.error("Error adding user:", error);
    return res.status(500).json({ message: "Error adding user", error });
  }
};

// Function to update a user
export const updateUser = async (req, res) => {
  try {
    const { userId } = req.params;
    const { name, email, phone } = req.body;
    const { role } = req.user; // AccountId and role are now part of req.user

    // Log accountId and role to verify they're coming from the JWT correctly

    // Check if the logged-in user is an admin
    if (role !== "Admin") {
      return res
        .status(403)
        .json({ message: "Forbidden: Only admins can update users" });
    }

    // Find the user by ID
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Update user details
    user.name = name || user.name;
    user.email = email || user.email;
    user.phone = phone || user.phone;

    // Save the updated user
    await user.save();

    return res.status(200).json({ message: "User updated successfully", user });
  } catch (error) {
    return res.status(500).json({ message: "Error updating user", error });
  }
};

// Function to delete a user
export const deleteUser = async (req, res) => {
  try {
    const { userId } = req.params;
    const { role } = req.user; // AccountId and role are now part of req.user

    // Log accountId and role to verify they're coming from the JWT correctly

    // Check if the logged-in user is an admin
    if (role !== "Admin") {
      return res
        .status(403)
        .json({ message: "Forbidden: Only admins can delete users" });
    }
    // Find and delete the user
    const user = await User.findByIdAndDelete(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Find the account associated with the user and remove the user from the sub_users array
    const account = await Account.findById(user.account_id);
    if (account) {
      account.sub_users.pull({ user_id: user._id });
      await account.save();
    }

    return res.status(200).json({ message: "User deleted successfully" });
  } catch (error) {
    return res.status(500).json({ message: "Error deleting user", error });
  }
};

// Login function -- working
export const loginUser = async (req, res) => {
  const { email, password } = req.body;
  try {
    // Check if user exists
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    // Verify password
    const isMatch = await bcrypt.compare(
      password.trim(),
      user.password.trim()
    );
    if (!isMatch) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    // Create JWT payload with accountId and other user info
    const payload = {
      userId: user._id,
      email: user.email,
      role: user.role, // Admin/User
      accountId: user.account_id, // Assuming `account_id` exists on the `user` model
      userName: user.name,
    };

    console.log("JWT Payload:", payload); // Debug the payload here

    // Generate JWT token
    const token = jwt.sign(payload, process.env.JWT_SECRET_KEY, {
      expiresIn: "30d", // Token expires in 30 days
    });

    // Store the token in an HTTP-Only cookie
    res.cookie("TOKEN", token, {
      httpOnly: true, // Prevents client-side access
      secure: process.env.NODE_ENV === "production", // Use HTTPS in production
      sameSite: "strict", // CSRF protection
      maxAge: 365 * 24 * 60 * 60 * 1000, // 365 days in milliseconds
    });

    // Send token also in the JSON response
    res
      .status(200)
      .json({ message: "Login successful", userId: user._id, token });
  } catch (error) {
    console.error("Error logging in:", error);
    res.status(500).json({ message: "Error logging in", error: error.message });
  }
};
// Function to logout a user (handled on frontend)
export const logoutUser = (req, res) => {
  try {
    // Clear the JWT cookie by setting its expiration time to 0
    res.cookie("TOKEN", "", {
      httpOnly: true, // Ensures client-side JavaScript can't access the cookie
      secure: process.env.NODE_ENV === "production", // Use HTTPS in production
      sameSite: "strict", // Protects against CSRF attacks
      maxAge: 0, // Set the maxAge to 0 to immediately expire the cookie
    });

    return res.status(200).json({ message: "Logout successful" });
  } catch (error) {
    console.error("Error logging out:", error);
    return res.status(500).json({ message: "Error logging out", error });
  }
};
