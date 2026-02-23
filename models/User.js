

const { Schema, models, model } = require("mongoose");



const UserSchema = new Schema ({
    firstName : 
    {type : String ,
     minLength : 2,
     maxLength : 20,
     required :[true , 'First name is required'] ,
     trim : true 
    },
     lastName : 
    {type : String ,
     minLength : 2 ,
     maxLength : 20,
     required :[true , 'Last name is required'] ,
     trim : true 
    },

   email : 
   {
    type : String ,
    unique : true,
    required : [true ,'Email is required'] ,
    lowercase : true ,
    trim: true
   },

   role : 
   {
    type : String ,
    required : true  ,
    enum : ['admin' , 'user'] , 
    default : 'user'
},
   
    password : {
        type : String ,
       required :[true , 'Password is required'] ,
       trim :true , 
       minLength : 8 ,
       
    }    
},
{timestamps :true})


const User = models.User || model('User' , UserSchema)
export default User
