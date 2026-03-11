import User from "@/models/User";
import connectDB from "@/utils/connectDB";
import Validator from "fastest-validator";
import { hash } from "bcryptjs";

const v = new Validator();
const check = v.compile({
  firstName: { type: "string", min: 3, max: 255 },
  lastName: { type: "string", min: 3, max: 255 },
  email: { type: "email" },
  password: { type: "string", min: 8 },
  $$strict: true
});

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method not allowed" });
  }

  try {
    // Ensure database connection is established
    await connectDB();

    const validation = check(req.body);
    if (validation !== true) {
      return res.status(422).json({ message: validation[0].message });
    }

    let { firstName, lastName, email, password } = req.body;
    email = email.trim().toLowerCase();

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(422).json({ message: "E-Mail already exists!" });
    }

    // Set role: first user becomes admin, others are users
    const userCount = await User.estimatedDocumentCount();
    const role = userCount === 0 ? "admin" : "user";
    
    // Hash password before saving
    const hashedPassword = await hash(password, 12);

    const user = await User.create({ 
      firstName, 
      lastName, 
      email, 
      password: hashedPassword, 
      role 
    });

   return res.status(201).json({ 
  message: "User Created Successfully!", 
  payload: { 
    firstName: user.firstName, 
    lastName: user.lastName, 
    role: user.role 
  } 
});

  } catch (e) {
    // Log the actual error to Vercel console for debugging
    console.error("Registration Error:", e);
    return res.status(500).json({ 
      message: "Server Error", 
      error: e.message // This will show you exactly what failed (e.g., Auth failed, Timeout, etc.)
    });
  }
}