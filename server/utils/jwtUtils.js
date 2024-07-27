import jwt from "jsonwebtoken";

// Function to generate a JWT token
export const generateToken = (user) => {
  try {
    const JWT_SECRET = process.env.JWT_SECRET; // Ensure you have a secret in your .env
    console.log("Secrete", process.env.JWT_SECRET);

    const token =  jwt.sign(
      { _id: user._id, role: user.role }, // Payload
      JWT_SECRET,
      { expiresIn: "3d" } // Token expiration time
    );
    return token;
  } catch (error) {
    console.error("Error generating token:", error);
  }
};
