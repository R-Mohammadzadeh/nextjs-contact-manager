import { useEffect, useRef, useState } from "react"
import toast, { Toaster } from "react-hot-toast";
import styles from '@/styles/add-contact.module.css'
import { ImSpinner3 } from "react-icons/im";



export default function AddContacts () {

const INITIAL_STATE = {firstName : '' , lastName : '' , age : '' , phone :'' ,gender :''} ;

const[formInfo , setFormInfo] = useState(INITIAL_STATE);
const inputRef = useRef();
const [loading , setLoading] = useState(false);


useEffect(() => {
    inputRef.current?.focus()
},[])
 
// handle inputs
const inputHandler = (e) => {
    const {name , value} = e.target ;
   setFormInfo((prev) => ({...prev , [name]: value})) ;
}

// validation
const validationForm = () => {
const {firstName , lastName , age , phone } = formInfo ;
const rules = [
    {test :!firstName?.trim() || firstName.trim().length < 2 , msg : 'First name is to short'},
    {test :!lastName?.trim() || lastName.trim().length < 2 || lastName.trim().length > 50 , msg : 'First name is to short or long'},
    {test :isNaN(age) || Number(age) < 18 , msg :'Invalid age'},
    {test :!/^[0-9]{10,15}$/.test(phone) , msg : 'Invalid phone number'} ,
    {test :!['male' , 'female' , 'others'].includes(formInfo.gender) , msg :'Invalid gender'}

]
const error = rules.find(rul => rul.test)
if(error){
toast.error(error.msg)
return false
}
return true
}

// submit
const subHandler = async (e) => {
e.preventDefault();
if(!validationForm()) return ;

setLoading(true)

try{
const payload = {...formInfo , age :Number(formInfo.age)}

const res = await fetch('/api/contact' , {
    method : 'POST' ,
    headers : {'Content-Type' : 'application/json'} ,
    body : JSON.stringify(payload)
})
const data = await res.json()
if(!res.ok) throw new Error(data.message || 'Something went wrong')
    

toast.success('Contact added successfully!')
setFormInfo(INITIAL_STATE)
inputRef.current.focus()
}
catch(error){
toast.error(error.message || 'Could not connect to the server.')
}finally {
    setLoading(false)
}
}



    return (
<>
 <Toaster position="top-right" />
<div className={styles.container}>
  <form onSubmit={subHandler}>
    <input
     ref={inputRef}
      value={formInfo.firstName}
       type="text"
        placeholder="first Name"
         name="firstName" 
         onChange={inputHandler} 
          />

    <input
     type="text"
      value={formInfo.lastName}
       placeholder="last Name"
        onChange={inputHandler}
         name="lastName"  />

    <input 
    type="number"
    value={formInfo.age} 
    placeholder="age"
     onChange={inputHandler}
      name="age" min='18' />

    <select name="gender" onChange={inputHandler} value={formInfo.gender} >
        <option value=""  hidden disabled>select gender</option>
        <option value="male">male</option>
        <option value="female">female</option>
        <option value="others">others</option>
    </select>

    <input
     type="text"
      value={formInfo.phone}
       placeholder="phone"
        onChange={inputHandler}
         name="phone" />

    <button disabled={loading} type="submit" >
      {loading ? <ImSpinner3 className={styles.spin} /> : 'Add Contact'}  
    </button>
  </form>

</div>

</>
    )
}







