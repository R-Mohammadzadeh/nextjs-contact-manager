import Contact from "@/models/Contact";
import connectDB from "@/utils/connectDB";


const escapeRegex = (text) => text.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")
 



export default async function handler (req , res) {

try{
await connectDB() ; 

// =================GET====================
if(req.method === 'GET') {
  const {gen , search} = req.query ;
  const query = {
    ...(gen && ['male','female','others'].includes(gen) && {gender : gen}) ,
    ...(search && {
      $or : [
       {firstName : {$regex :escapeRegex(search)  , $options : 'i'}} ,
       {lastName : {$regex : escapeRegex(search)  , $options : 'i'}} ,
       {phone : {$regex : escapeRegex(search) , $options : 'i'}} ,
      ]
    })
  }

  const contacts = await Contact.find(query).sort({createdAt : -1}) 
  return res.status(200).json(contacts)
}

// =================POST====================
if(req.method === 'POST') {
  if(!req.body || Object.keys(req.body).length === 0 ){
    return res.status(400).json({message : "Request body is required"})
  }
  const newContact = await Contact.create(req.body) ;
  return res.status(201).json({message : 'new conntact added to db' , data : newContact})
}

// ================= METHOD NOT ALLOWED =================
res.setHeader('Allow' , ['GET' , 'POST'])
return res.status(405).json({message : `method ${req.method} not allowed`})

}
catch(error)
{
  
if(error.name === 'ValidationError'){
const messages = Object.values(error.errors).map(e => e.message)
  return res.status(422).json({message : messages.join(', ')})
}
  
if(error.code === 11000) {
  return res.status(409).json({message : 'This contact already exists.'})
}

console.error('API Error:', error);
    return res.status(500).json({ message: 'Internal Server Error' });
 }
}














