import { serialize } from "cookie";

export default function handler(req, res) {
  if (req.method !== "GET" && req.method !== "POST") {
    return res.status(405).json({ message: "Method not allowed" });
  }

//  Clear the token cookie by setting it to an empty value and expiring it immediately
  const serialized = serialize("token", "", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
   expires: new Date(0), // Set the cookie to expire immediately
   path: "/", // Ensure the cookie is cleared for the entire site
  });

  res.setHeader("Set-Cookie", serialized);

  return res.status(200).json({ message: "Logged out successfully" });
}