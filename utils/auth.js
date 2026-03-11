import { verify } from "jsonwebtoken";

// Using English comments as you requested
export default function validateToken({ req }) {
  try {
    const token = req.cookies?.token;

    if (!token) {
      console.log("No token found in cookies");
      return null;
    }

    // Verify the token
    const decoded = verify(token, process.env.JWT_SECRET);
    
    // Ensure the decoded data matches the structure your frontend expects
    return decoded; 
  } catch (error) {
    // If token is expired or secret is wrong, don't just crash, log it
    console.error("JWT Error:", error.message);
    return null;
  }
}