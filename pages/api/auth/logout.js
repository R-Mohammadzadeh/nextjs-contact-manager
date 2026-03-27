import { serialize } from "cookie";

export default function handler(req, res) {
  res.setHeader(
    "Set-Cookie",
    serialize("token", "", {
      httpOnly: true,
      secure: true && process.env.NODE_ENV === "production",
      sameSite: "Lax",
      expires: new Date(0),
      path: "/",
    })
  );
  return res.status(200).json({ message: "Logged out" });
}