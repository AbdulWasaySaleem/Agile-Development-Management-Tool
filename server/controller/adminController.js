import userModel from "../Model/userModel";

export const handleUserApproval = async (req, res) => {
  try {
    const { userId, approve } = req.body;

    // Find user by ID
    const user = await userModel.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Update user status
    user.status = approve ? "approved" : "rejected";
    await user.save();

    res.status(200).json({
      message: `User ${approve ? "approved" : "rejected"} successfully`,
    });
  } catch (error) {
    res.status(500).json({ status: false, message: "Server error", error });
  }
};
