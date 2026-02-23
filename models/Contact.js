const { Schema, models, model } = require("mongoose");



const ContactSchema = new Schema ({
    firstName : 
    {type : String ,
     minLength : [2 , 'First name is shortName must be at least 2 characters.'] ,
     maxLength : 20,
     required :[true , 'First name is required'] ,
     trim : true 
    },
     lastName : 
    {type : String ,
     minLength : [2 , 'Last name is shortName must be at least 2 characters.'] ,
     maxLength : 20,
     required :[true , 'Last name is required'] ,
     trim : true 
    },

   age : 
   {
    type : Number ,
    min:[18 , 'Age must be at least 18.'] ,
    max :[70 , 'Age must be at least 70.'] ,
    required : [true ,'age is required']
   },

   gender : 
   {
    type : String ,
    enum : {values :['male' , 'female' , 'others'],
    message : '{VALUE} is not allowed' ,},
    required : [true , 'gender is required']},
   
    phone : {
        type : String ,
       required :[true , 'phone is required'] ,
       match : [/^[0-9]{10,20}$/ , 'The contact number must be between 10 and 20 digits.'] ,
       trim :true
    }    
},
{timestamps :true})


const Contact = models.Contact || model('Contact' , ContactSchema)
export default Contact
