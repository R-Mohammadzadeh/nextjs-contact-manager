import User from "@/models/User";
import connectDB from "@/utils/connectDB";
import Validator from "fastest-validator";
import { hash } from "bcryptjs";


// Benutzerdefinierte Meldungen auf Deutsch definieren

const germanMessages = {
  stringMin : "Das Feld '{field}' muss mindestens {expected} Zeichen lang sein.",
  stringMax: "Das Feld '{field}' darf höchstens {expected} Zeichen lang sein.",
  email: "Bitte geben Sie eine gültige E-Mail-Adresse ein.",
  required: "Das Feld '{field}' ist ein Pflichtfeld.",
  string: "Das Feld '{field}' muss (String) sein."
}

const v = new Validator({messages : germanMessages});

// Schema Definition
const Schema = {
  firstName: { type: 'string', min: 3, max: 255 , label: "Vorname" },
  lastName: { type: 'string', min: 3, max: 255, label: "Nachname" },
  email: { type: 'email', label: "E-Mail" }, 
  password: { type: 'string', min: 6 , label: "Passwort"},
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
        message: validationResponse[0].message, 
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
    const hashedPass = await hash(password, Number(process.env.SALT_ROUNDS) || 12 );


const contUsers = await User.countDocuments()

    // Benutzer erstellen
    const newUser = await User.create({ 
      firstName, 
      lastName, 
      email, 
      password: hashedPass ,
      role : contUsers > 0 ? 'user' : 'admin'
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