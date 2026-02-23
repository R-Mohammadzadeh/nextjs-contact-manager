import User from "@/models/User"
import connectDB from "@/utils/connectDB"


export default async function handler (req , res) {

await connectDB()

    // check method
    if(req.method !== 'POST') return res.status(405).json({message : 'Method not Allowed'})

// validation  or fastes validation
const {firstName , lastName , email , password} = req.body
if(!firstName || !lastName || !email || !password) return res.status(422).json({message : 'All Fields are required'})



// check email exist

const isEmailExist = await User.findOne({email})

console.log(isEmailExist);




}