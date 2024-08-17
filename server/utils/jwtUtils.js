import jwt from "jsonwebtoken";

// Function to generate a JWT token
export const generateToken = (userId, res) => {
  try {
    const JWT_SECRET = process.env.JWT_SECRET; 
    //console.log("Secrete", process.env.JWT_SECRET);

    const token =  jwt.sign(
      { userId}, // Payload
      JWT_SECRET,
      { expiresIn: "3d" } // Token expiration time
    );

    res.cookie("jwt", token, {
      maxAge: 15 * 24 * 60 * 60 * 1000, // ms
      httpOnly: true, // prevent XSS attacks (Cross-site scripting attack)
      sameSite: 'strict' // CSRF attack (Cross-site request forgery attack)
    });

    return token;
  } catch (error) {
    console.error("Error generating token:", error);
  }
};
