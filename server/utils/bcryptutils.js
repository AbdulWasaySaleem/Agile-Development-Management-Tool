import bcrypt from 'bcrypt';

const saltRounds = 10; // Number of salt rounds for hashing

// Function to hash a password
export const hashPassword = async (password) => {
  try {
    const hashedPassword = await bcrypt.hash(password, saltRounds);
    return hashedPassword;
  } catch (error) {
    console.error('Error hashing password:', error);
    throw error;
  }
};

// Function to compare a plain password with a hashed password
export const comparePassword = async (plainPassword, hashedPassword) => {
  try {

    if (!plainPassword || !hashedPassword) {
      throw new Error('Both plainPassword and hashedPassword are required');
    }

    const isMatch = await bcrypt.compare(plainPassword, hashedPassword);
    return isMatch;
  } catch (error) {
    console.error('Error comparing passwords:', error);
    throw error;
  }
};