import { serialize } from "cookie";

export default function handler(req, res) {
  try {
    res.setHeader(
      "Set-Cookie",
      serialize("token", "", {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "Lax",
        expires: new Date(0),
        path: "/",
      })
    );
    return res.status(200).json({ message: "Logged out" });
  } catch (error) {
    // This helps you see the real error in Vercel logs
    return res.status(500).json({ message: "Internal Server Error", error: error.message });
  }
}