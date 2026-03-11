import { verify } from "jsonwebtoken";
import connectDB from "@/utils/connectDB";
import User from "@/models/User";

// English comments for your project
export default async function handler(req, res) {
  if (req.method !== "GET") return res.status(405).json({ message: "Method not allowed" });

  const { token } = req.cookies;
  
  // To avoid red 401 errors in console when user is just visiting the page
  if (!token) {
  // Return 200 instead of 401 to keep the console clean
  return res.status(200).json({ 
    authenticated: false, 
    payload: null, 
    message: "User is not logged in" 
  });
}

  try {
    await connectDB();
    
    // Verify token with the secret key from your Vercel env variables
    const decoded = verify(token, process.env.JWT_SECRET);
    
    const user = await User.findById(decoded._id).select("firstName lastName role");
    
    if (!user) return res.status(404).json({ message: "User not found" });

    // IMPORTANT: Return 'payload' so your frontend doesn't crash
    return res.status(200).json({ 
      message: "Authorized", 
      payload: {
        firstName: user.firstName,
        lastName: user.lastName,
        role: user.role,
        _id: user._id
      } 
    });
  } catch (error) {
    // If token is expired or invalid
    return res.status(200).json({ message: "Invalid token", payload: null });
  }
}