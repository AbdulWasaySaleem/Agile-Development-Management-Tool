import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'random123'; // Ensure you have a secret in your .env

// Function to generate a JWT token
export const generateToken = (user) => {
  try {
    const token = jwt.sign(
      { userId: user._id, role: user.role }, // Payload
      JWT_SECRET,
      { expiresIn: '3d' } // Token expiration time
    );
    return token;
  } catch (error) {
    console.error('Error generating token:', error);
    throw new Error('Error generating token');
  }
};

// Function to verify a JWT token
export const verifyToken = (token) => {
  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    return decoded;
  } catch (error) {
    console.error('Error verifying token:', error);
    throw new Error('Error verifying token');
  }
};
