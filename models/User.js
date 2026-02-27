

const { Schema, models, model } = require("mongoose");



const UserSchema = new Schema ({
    firstName : 
    {type : String ,
     minLength : 2,
     maxLength : 50,
     required :[true , 'First name is required'] ,
     trim : true 
    },
     lastName : 
    {type : String ,
     minLength : 2 ,
     maxLength : 50,
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
       select :false ,
       minLength : 8 ,
       validate :{
        validator : function(v) {
    // At least 1 uppercase letter, 1 lowercase letter, 1 number and 1 special character
      return  /(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}/.test(v);
        }
       }
    }    
},
{timestamps :true})


const User = models.User || model('User' , UserSchema)
export default User
