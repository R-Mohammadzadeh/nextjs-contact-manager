
import { useState } from 'react';
import { FaRegEye, FaRegEyeSlash } from "react-icons/fa";
import styles from '@/styles/login.module.css';
import Link from 'next/link';

export default function Login() {
  const [showPassword, setShowPassword] = useState(false);

  return (
   
      <div className={styles.container}>
        <form onSubmit={(e) => e.preventDefault()}>
          <input type="email" placeholder="Email" className={styles.inputField} />

          <div className={styles.password}>
            <input 
              type={showPassword ? "text" : "password"} 
              placeholder="Password" 
            
            /> 
            <span className={styles.eyes} onClick={() => setShowPassword(!showPassword)}>
                {showPassword ? <FaRegEyeSlash size='20px'/> : <FaRegEye size='20px'/>}
            </span>
           
          </div>

          <button type="submit" className={styles.submitBtn}>Login</button>
          
          <div className={styles.message}>
            Not registered yet? <Link href="/auth/register">Create an account</Link>
          </div>
        </form>
      </div>
 
  );
}