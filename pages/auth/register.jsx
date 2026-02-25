
import { useState } from 'react';
import { FaRegEye, FaRegEyeSlash } from "react-icons/fa";
import styles from '@/styles/login.module.css';
import Link from 'next/link';
import toast ,{Toaster} from 'react-hot-toast';
export default function Register() {

const INITIOAL_STATE = {firstName:'' , lastName:'' , email:'' , password :''} 
const [showPassword, setShowPassword] = useState(false);
const[formData ,setFormData ] = useState(INITIOAL_STATE)



const inputHandler = (e) => {
const {name , value} = e.target ;
setFormData(prevData => ({
  ...prevData , [name] : value
}))
}



const subHandler = async (e) => {
e.preventDefault() ;



const res = await fetch('/api/auth/register' , {
   method : 'POST' , 
   headers : {'Content-Type' : 'application/json'} ,
   body : JSON.stringify(formData)
})
const data = await res.json()
if(res.status === 201) {
  toast.success(data.message) ;
  setFormData(INITIOAL_STATE)
}else {
  toast.error(data.message || "Something went wrong!")
}
}





  return (
   <>
   <Toaster position='top-right' />
     <div className={styles.container}>
        <form onSubmit={subHandler}>
            <input type="text" placeholder='firstName' onChange={inputHandler} name='firstName' value={formData.firstName} />
            <input type="text" placeholder='lastName' onChange={inputHandler} name='lastName' value={formData.lastName} />
          <input type="email" placeholder="Email" className={styles.inputField} onChange={inputHandler} name='email' value={formData.email} />

          <div className={styles.password}>
            <input 
              type={showPassword ? "text" : "password"} 
              placeholder="Password" 
            onChange={inputHandler} name='password' value={formData.password}
            /> 
            <span className={styles.eyes} onClick={() => setShowPassword(!showPassword)}>
                {showPassword ? <FaRegEyeSlash size='20px'/> : <FaRegEye size='20px'/>}
            </span>
           
          </div>

          <button type="submit" className={styles.submitBtn}>Register</button>
          
          <div className={styles.message}>
            Allready Register ? <Link href="/auth/login">Login</Link>
          </div>
        </form>
      </div>
 
   </>



    
  );
}










