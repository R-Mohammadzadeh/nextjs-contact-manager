import Contact from "@/models/Contact";
import validateToken from "@/utils/auth";
import connectDB from "@/utils/connectDB";
import { generateContactFilter } from "@/utils/contactHelpers";




export default async function handler(req, res) {
  try {
    await connectDB();
// 1. Verify user identity on every request (GET or POST) 
const payload = validateToken({req}) ; 
if(!payload) {
  return res.status(401).json({message :'Please log in to your account first.'}) 
}

const userId = payload.userId

    // ================= GET =================
    if (req.method === "GET") {
     
      const filter = generateContactFilter(userId , req.query)
      const contacts = await Contact.find(filter).sort({ createdAt: -1 });
      return res.status(200).json(contacts);
    }

    // ================= POST =================
    if (req.method === "POST") {
      if (!req.body || Object.keys(req.body).length === 0)
        return res.status(400).json({ message: "Request body is required" });

      const contactData = {...req.body , userId} ;
      const newContact = await Contact.create(contactData);
      return res.status(201).json({ message: "New contact added", data: newContact });
    }

    // ================= METHOD NOT ALLOWED =================
    res.setHeader("Allow", ["GET", "POST"]);
    return res.status(405).json({ message: `Method ${req.method} not allowed` });
  } catch (error) {
    // Mongoose validation error
    if (error.name === "ValidationError") {
      const messages = Object.values(error.errors).map(e => e.message);
      return res.status(422).json({ message: messages.join(", ") });
    }

    // Duplicate key error
    if (error.code === 11000)
      return res.status(409).json({ message: "This contact already exists." });

    console.error("API Error:", error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
}