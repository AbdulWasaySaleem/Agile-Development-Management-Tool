import userModel from "../Model/userModel.js";
import { hashPassword,comparePassword } from '../utils/bcryptutils.js';
import { generateToken } from '../utils/jwtUtils.js';

export const createUser = async (req, res) => {
  try {
    const {
      name,
      email,
      password,
      phone,
      address,
      gender,
      role,
      profilePicture,
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
    // Create a user record with pending status
    const newUser = new userModel({
      name,
      email,
      password:hashedPassword,
      phone,
      address,
      gender,
      role: "unauthorized_user", // Default role
      profilePicture,
    });

    await newUser.save();

    res
      .status(201)
      .send({ message: "User details submitted successfully", user: newUser });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error submitting user details", error });
  }
};

export const login = async (req,res)=>{
  try {
    const {email, password} = req.body
    // Validation
    if (!email || !password) {
      return res
        .status(400)
        .send({ message: "Invalid mail or password" });
    }

    const user = await userModel.findOne({email})
    if(!user){
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
    //generating token
    const token = generateToken(user);
    //sending response
    res.status(200).send({
      success: true,
      message: "Login successful",
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role
      }
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error in login", error });
  }
}
