import User from "@/models/User";
import connectDB from "@/utils/connectDB";
import Validator from "fastest-validator";
import jwt from 'jsonwebtoken'
import { compare } from "bcryptjs";




const v = new Validator();

// Schema Definition
const Schema = {
  email: { type: 'email' }, 
  password: { type: 'string', min: 6 },
  $$strict: true ,
  
};

const check = v.compile(Schema);

export default async function loginHandler(req, res) {
  try {
    await connectDB();

    // Check Method
    if (req.method !== 'POST') {
      return res.status(405).json({ message: 'Method not Allowed' });
    }

    // Validierung
    const validationResponse = check(req.body);
    if (validationResponse !== true) {
      return res.status(422).json({ 
        message: "Validation failed", 
        errors: validationResponse 
      });
    }
// email check
    let {email, password } = req.body;
    email = email?.trim().toLowerCase();

// 1. Finde den Benutzer
    const user = await User.findOne({ email });
    if (!user) {
// Aus Sicherheitsgründen halten wir die Nachricht verschleiert.      
      return res.status(401).json({ message: 'email or password invalid!' });
    }

// 2. Passwortvergleich
const isPasswordCorrect = await compare(password , user.password)
if(!isPasswordCorrect) return res.status(401).json({ message: "Email or password is wrong!" });

// 3. Token-Generierung
const JWt_SECRET = process.env.JWt_SECRET || 'your_fallback_secret' ;
const token = jwt.sign(
  {email :user.email , role :user.role , _id :user._id} , JWt_SECRET , {
    expiresIn : '24h'
})
// Sende die endgültige Antwort und beende das Programm.
res.status(200).json({message : ' user login successfully' , token})

    return res.status(201).json({
      message: 'User logged in successfully',
     token
    });

  } catch (error) {
    console.error("DEBUG ERROR:", error.message);
    return res.status(500).json({ message: 'Server Error' , error :error.message});
  }
}


