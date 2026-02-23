import User from "@/models/User";
import connectDB from "@/utils/connectDB";
import Validator from "fastest-validator";
import { hash } from "bcryptjs";

const v = new Validator();

// Schema Definition
const Schema = {
  firstName: { type: 'string', min: 3, max: 255 },
  lastName: { type: 'string', min: 3, max: 255 },
  email: { type: 'email' }, 
  password: { type: 'string', min: 6 },
  $$strict: true ,
  
};

const check = v.compile(Schema);

export default async function handler(req, res) {
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

    let { firstName, lastName, email, password } = req.body;
    email = email?.trim().toLowerCase();

    const isEmailExist = await User.findOne({ email });
    if (isEmailExist) {
      return res.status(422).json({ message: 'User already exists!' });
    }

    // HASHING PASSWORD
    const hashedPass = await hash(password, Number(process.env.SALT_ROUNDOS) || 12 );

    // Benutzer erstellen
    const newUser = await User.create({ 
      firstName, 
      lastName, 
      email, 
      password: hashedPass ,
      role : 'user' 
    });

    return res.status(201).json({
      message: 'User created successfully!',
      data: { email: newUser.email }
    });

  } catch (error) {
    console.error("DEBUG ERROR:", error.message);
    return res.status(500).json({ message: 'Server Error' , error :error.message});
  }
}