import Contact from "@/models/Contact";
import connectDB from "@/utils/connectDB";
import { isValidObjectId } from "mongoose";



export default async function updatedContact (req , res) {
try{

await connectDB()
const{_id} = req.query || {}
if(!isValidObjectId(_id)) {
return res.status(400).json({message :'Contact not found'})

}

// ===============GET============
if(req.method === 'GET') {
const contacts = await Contact.findById(_id)
if(!contacts) return res.status(404).json({message : 'Contact not found'})
return res.status(200).json(contacts) ;
}

// ===============DELETE============
if(req.method === 'DELETE') {
const deleted = await Contact.findByIdAndDelete(_id)
if(!deleted) return res.status(404).json({message : 'Contact not found'})
return res.status(200).json({message : 'Contact deleted successfully'})   ; 
}


// ===================PUT================
if(req.method === 'PUT') {
if(!req.body || Object.keys(req.body).length === 0) return res.status(400).json({message :'No data has been sent for update.'})

const newUpdate = await Contact.findByIdAndUpdate(_id , req.body, {new :true , runValidators :true })

if(!newUpdate) return res.status(404).json({message :'Contact not found' })
return res.status(200).json({message : 'new contact updated successfully' , data : newUpdate})  ;
}


// ======= Method Not Allowed =======
res.setHeader('Allow' , ['GET','DELETE','PUT'])
return res.status(405).json({message : `Methode ${req.method} no allowed`})

}
catch(error){
if(error.name === 'ValidationError') {
const messages = Object.values(error.errors).map(e => e.message)
return res.status(422).json({message : 'Validation failed' , messages})
}
console.error('database error' , error)
res.status(500).json({message : 'Internal Server Error'})
}
} ;