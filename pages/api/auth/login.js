import User from "@/models/User";
import connectDB from "@/utils/connectDB";
import Validator from "fastest-validator";
import jwt from "jsonwebtoken";
import { compare } from "bcryptjs";
import { serialize } from "cookie";

const check = new Validator().compile({
  email: { type: "email", empty: false },
  password: { type: "string", min: 8, empty: false },
  $$strict: true,
});

export default async function loginHandler(req, res) {
  if (req.method !== "POST")
    return res.status(405).json({ message: "Method not allowed" });

  await connectDB();

  const validation = check(req.body);
  if (validation !== true)
    return res.status(422).json({ message: "Validation failed", errors: validation });

  let { email, password } = req.body;
  email = email.trim().toLowerCase();

  const user = await User.findOne({ email }).select("+password firstName lastName role email");
  if (!user || !(await compare(password, user.password || "")))
    return res.status(401).json({ message: "Invalid email or password!" });

// generate token
  const token = jwt.sign(
    { _id: user._id, email: user.email, role: user.role, firstName: user.firstName , userId : user._id },
    process.env.JWT_SECRET,
    { expiresIn: "12h" }
  );

  res.setHeader(
    "Set-Cookie",
    serialize("token", token, {
      httpOnly: true,
      secure: true && process.env.NODE_ENV === "production",
      sameSite: "lax ", // Note the trailing space
      path: "/",
      maxAge: 60 * 60 * 12,
    })
  );

  return res.status(200).json({
    message: "Success",
    payload: { firstName: user.firstName, lastName: user.lastName, role: user.role },
  });
}