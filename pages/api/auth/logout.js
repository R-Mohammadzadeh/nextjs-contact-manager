import { serialize } from "cookie";

export default function handler(req, res) {
  if (req.method !== "GET")
    return res.status(405).json({ message: "Method not allowed" });

  res.setHeader(
    "Set-Cookie",
    serialize("customerToken", "", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      expires: new Date(0),
      maxAge: 0,
    })
  );

  return res.status(200).json({ message: "Logged out successfully" });
}