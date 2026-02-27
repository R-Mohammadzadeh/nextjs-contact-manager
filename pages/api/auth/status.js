import { verify } from "jsonwebtoken";
import connectDB from "@/utils/connectDB";
import User from "@/models/User";

export default async function handler(req, res) {
  if (req.method !== "GET") return res.status(405).json({ message: "Method not allowed" });

  const { token } = req.cookies;
  if (!token) return res.status(401).json({ message: "Unauthorized" });

  try {
    await connectDB();
    const payload = verify(token, process.env.JWT_SECRET);
    const user = await User.findById(payload._id).select("firstName lastName role");
    if (!user) return res.status(404).json({ message: "User not found" });

    res.status(200).json({ message: "Authorized", user });
  } catch {
    res.status(401).json({ message: "Unauthorized" });
  }
}