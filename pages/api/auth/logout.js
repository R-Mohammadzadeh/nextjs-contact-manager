import { serialize } from "cookie";

export default function handler(req, res) {
  if (req.method !== "GET" && req.method !== "POST") {
    return res.status(405).json({ message: "Method not allowed" });
  }

  res.setHeader(
    "Set-Cookie",
    serialize("token", "", {
      httpOnly: true,
      secure:true && process.env.NODE_ENV === "production",
      sameSite: "Lax", 
      expires: new Date(0), // Set the cookie to expire immediately
      path: "/",
      
    })
  );
  return res.status(200).json({ message: "Logged out successfully" });
  
}