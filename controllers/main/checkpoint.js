import CheckPoint from "../../models/Core/Checkpoint.js";
import User from "../../models/Core/User.js";


// Create a new checkpoint (automatically assigns account_id from logged-in user)  --tested
export const createCheckpoint = async (req, res) => {
  try {
    console.log("here");
    // Destructure userId from the request user object
    const { userId } = req.user;

    // Find user by ID and ensure the user exists
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Check if necessary fields exist in request body
    const { name } = req.body;
    if (!name) {
      return res.status(400).json({ message: "Checkpoint name is required" });
    }

    // Check if checkpoint already exists for the user's account

    const alreadyExistFlag = await CheckPoint.findOne({
      name: name,
      account_id: user.account_id,
    });

    if (alreadyExistFlag) {
      return res
        .status(400)
        .json({ message: "Checkpoint already exists for this account." });
    }

    // Create a new checkpoint
    const checkpoint = new CheckPoint({
      ...req.body,
      account_id: user.account_id, // Ensure checkpoint is assigned to user's account
    });

    // Save checkpoint to the database
    await checkpoint.save();

    // Respond with success message and the created checkpoint
    res
      .status(201)
      .json({ message: "Checkpoint created successfully", checkpoint });
  } catch (error) {
    // Handle unexpected errors and respond with a meaningful message
    console.error(error); // Log the error for debugging
    res
      .status(500)
      .json({ message: "Error creating checkpoint", error: error.message });
  }
};

// Get all checkpoint for the logged-in user's account --tested
export const getCheckpointForUser = async (req, res) => {
  try {
    const { userId } = req.user;
    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ message: "User not found" });

    const checkpoint = await CheckPoint.find({ account_id: user.account_id });
    res.status(200).json(checkpoint);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error fetching checkpoint", error: error.message });
  }
};

// Get a specific checkpoint by ID
export const getCheckpointById = async (req, res) => {
  try {
    const checkpoint = await CheckPoint.findById(req.params.id);
    if (!checkpoint)
      return res.status(404).json({ message: "checkpoint not found" });

    res.status(200).json(checkpoint);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error fetching checkpoint", error: error.message });
  }
};
//
// Update a checkpoint (only if it belongs to the user's account)
export const updateCheckpoint = async (req, res) => {
  try {
    const { userId } = req.user;
    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ message: "User not found" });

    const checkpoint = await CheckPoint.findOneAndUpdate(
      { _id: req.params.id, account_id: user.account_id },
      req.body,
      { new: true }
    );

    if (!checkpoint)
      return res
        .status(404)
        .json({ message: "checkpoint not found or unauthorized" });

    res
      .status(200)
      .json({ message: "checkpoint updated successfully", checkpoint });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error updating checkpoint", error: error.message });
  }
};

//  Delete a checkpoint (only if it belongs to the user's account)
export const deleteCheckpoint = async (req, res) => {
  try {
    const { userId } = req.user;
    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ message: "User not found" });

    const checkpoint = await CheckPoint.findOneAndDelete({
      _id: req.params.id,
      account_id: user.account_id,
    });

    if (!checkpoint)
      return res
        .status(404)
        .json({ message: "checkpoint not found or unauthorized" });

    res.status(200).json({ message: "checkpoint deleted successfully" });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error deleting checkpoint", error: error.message });
  }
};
