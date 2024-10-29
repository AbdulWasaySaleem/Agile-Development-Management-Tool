import userModel from "../Model/userModel.js";
import { hashPassword, comparePassword } from "../utils/bcryptutils.js";
import { getDataUri } from "../utils/datauri.js";
import { generateToken } from "../utils/jwtUtils.js";
import cloudinary from "cloudinary";

export const signUp = async (req, res) => {
  try {
    const {
      name,
      email,
      password,
      phone,
      address,
      gender,
      skills,
      biography,
      socials,
      locations,
    } = req.body;

    // Validation
    if (!email || !password) {
      return res
        .status(400)
        .send({ message: "Please provide all required fields" });
    }

    //if user exist
    const existingUser = await userModel.findOne({ email });
    if (existingUser)
      return res.status(200).send({
        message: "User Already exits with that mail",
      });

    //hashing password
    const hashedPassword = await hashPassword(password);

    //default profile pic
    let profilePicURL;
    if (gender == "male") {
      profilePicURL = `https://avatar.iran.liara.run/public/boy?username=${name}`;
    } else if (gender == "female") {
      profilePicURL = `https://avatar.iran.liara.run/public/girl?username=${name}`;
    } else {
      profilePicURL = "https://i.ibb.co/4pDNDk1/avatar.png";
    }

    // Create a user record with pending status
    const newUser = new userModel({
      name,
      email,
      password: hashedPassword,
      phone,
      address,
      gender,
      role: "unauthorized_user", // Default role
      status: "pending",
      skills,
      biography,
      socials,
      locations,
      profilePicture: {
        public_id: "",
        url: profilePicURL,
      },
    });

    if (newUser) {
      generateToken(newUser._id, res);
      await newUser.save();

      res.status(201).send({
        message: "User details submitted successfully",
        user: newUser,
      });
    } else {
      res.status(400).send({ errpr: "Imvalid user data" });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error submitting user details", error });
  }
};

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    // Validation
    if (!email || !password) {
      return res.status(400).send({ message: "Invalid mail or password" });
    }

    const user = await userModel.findOne({ email });
    if (!user) {
      return res.status(404).send({
        success: false,
        message: "Email not register",
      });
    }

    // Compare the provided password with the stored hashed password
    const isMatch = await comparePassword(password, user.password);
    //console.log(password,user.password)

    if (!isMatch) {
      return res.status(401).json({ message: "Invalid credentials" });
    }
    // Check if user is approved
    if (user.status !== "approved") {
      return res.status(403).json({ message: "User not approved by admin" });
    }

    //generating token
    const token = generateToken(user._id, res);
    //sending response
    res.status(200).send({
      success: true,
      message: "User Login successful",
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        pic: user.profilePicture.url
        
      },
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error in login", error });
  }
};

//Logout user
export const logOut = (req, res) => {
  try {
    res.cookie("jwt", "", { maxAge: 0 });
    res.status(200).send({
      success: true,
      message: "User Logout Successfully!",
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error in Logout", error });
  }
};

//Update User Profile
export const updateProfile = async (req, res) => {
  try {
    const userId = req.params.id;
    const updates = req.body;
    const options = { new: true };

    const updatedUser = await userModel.findByIdAndUpdate(
      userId,
      updates,
      options
    );

    if (!updatedUser) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json({ user: updatedUser });
  } catch (error) {
    console.error("Error updating user profile", error);
    res.status(500).json({ message: "Error updating user profile" });
  }
};

//Update user Profile Picture
export const updateProfilePic = async (req, res) => {
  try {
    const userId = req.params.id;
    const user = await userModel.findById(userId);
    //getting photo
    const file = getDataUri(req.file);
    //deleting prev image
    if (user.profilePicture.public_id) {
      await cloudinary.v2.uploader.destroy(user.profilePicture.public_id);
    }
    //update
    const cloudinaryDB = await cloudinary.v2.uploader.upload(file.content);
    user.profilePicture = {
      public_id: cloudinaryDB.public_id,
      url: cloudinaryDB.secure_url,
    };
    //saving function
    await user.save();
    res.status(200).send({
      success: true,
      message: "Profile pic update",
      profilePicture: user.profilePicture,
    });
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ message: "Error submitting Update profile details", error });
  }
};

//get user Profile
export const getProfile = async (req, res) => {
  try {
    const userId = req.params.id;
    const user = await userModel.findById(userId);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).send({ success: true, message: "User Profile", user });
  } catch (error) {
    console.error("Error fetching user profile", error);
    res.status(500).json({ message: "Error fetching user profile" });
  }
};

//pending user
export const getPendingUser = async (req, res) => {
  try {
    const user = await userModel.find({ status: "pending" });
    res.status(201).send({
      sucess: true,
      message: "All pending Users",
      user,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error in get pending users...", error });
  }
};

//admin approves user
export const approveUser = async (req, res) => {
  try {
    const { id } = req.params;
    const { role } = req.body;

    // Update user status and role
    const user = await userModel.findByIdAndUpdate(
      id,
      { status: "approved", role },
      { new: true }
    );

    if (!user) {
      return res
        .status(404)
        .send({ success: false, message: "User not found" });
    }

    res.status(200).json({
      success: true,
      message: "User approved successfully",
      user,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error approving user", error });
  }
};


export const allUser = async (req, res) => {
  try {
    const users = await userModel.find().select('_id name skills profilePicture'); // Select only the fields you want
    res.status(200).send({ // Use status 200 for successful responses
      success: true, // Correct spelling from "sucess" to "success"
      message: "All Users",
      users, // Changed to "users" for consistency
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error in getting all users...", error });
  }
}
