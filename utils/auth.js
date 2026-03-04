import { verify } from "jsonwebtoken";

export default function validateToken({ req }) {
  try {
    const token = req.cookies?.token;
    
    return token ? verify(token, process.env.JWT_SECRET) : null;
  } catch {
    return null;
  }
}