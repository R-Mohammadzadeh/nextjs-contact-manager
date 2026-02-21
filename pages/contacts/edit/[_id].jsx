import Contact from "@/models/Contact";
import connectDB from "@/utils/connectDB";
import { useRouter } from "next/router";
import { useEffect, useRef, useState } from "react";
import toast, { Toaster } from "react-hot-toast";
import styles from '@/styles/add-contact.module.css'
import { ImSpinner3 } from "react-icons/im"



export default function EditContact ({contacts}) {

const router = useRouter()
const[formData , setFormData] = useState(contacts || {})
const[loading , setLoading] = useState(false)
const inputRef = useRef()

 useEffect(() => {
 inputRef.current?.focus()
 }, [])

  const inputHandler = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const subHandler = async (e) => {
    e.preventDefault()
    if (loading) return

    const requiredFields = ['firstName','lastName','age','gender','phone']
    const isFormOk = requiredFields.every( field => String(formData[field] || '').trim() !== '')
     


    if (!isFormOk) return toast.error('Please fill in all fields.')

    const { firstName, lastName, age, phone } = formData

    const rules = [
      { test: firstName.trim().length < 2, msg: 'First name too short' },
      { test: lastName.trim().length < 3, msg: 'Last name invalid' },
      { test: isNaN(age) || Number(age) < 18, msg: 'Invalid age' },
      { test: !/^[0-9]{10,15}$/.test(phone), msg: 'Invalid phone' }
    ]

    const error = rules.find(r => r.test)
    if (error) return toast.error(error.msg)

    setLoading(true)

    try {
      const payload = { ...formData, age: Number(formData.age) }

      const res = await fetch(`/api/contact/${formData._id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      })

      const data = await res.json()
      if (!res.ok) throw new Error(data.message)

      toast.success('Contact updated successfully')
      router.push('/contacts')
    } catch (error) {
      toast.error(error.message)
    } finally {
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
            value={formData.firstName || ''}
            name="firstName"
            placeholder="First Name"
            onChange={inputHandler}
          />

          <input
            value={formData.lastName || ''}
            name="lastName"
            placeholder="Last Name"
            onChange={inputHandler}
          />

          <input
            type="number"
            value={formData.age || ''}
            name="age"
            placeholder="Age"
            onChange={inputHandler}
          />

          <select
            name="gender"
            value={formData.gender || ''}
            onChange={inputHandler}
          >
            <option value="" hidden>Select gender</option>
            <option value="male">Male</option>
            <option value="female">Female</option>
            <option value="others">Others</option>
          </select>

          <input
            value={formData.phone || ''}
            name="phone"
            placeholder="Phone"
            onChange={inputHandler}
          />

          <button disabled={loading}>
            {loading ? <ImSpinner3 className={styles.spin} /> : 'Update Contact'}
          </button>
        </form>
      </div>
    </>
  )
}



export async function getServerSideProps({params}) {
await connectDB() ;   
const {_id} = params 

try{
const contacts = await Contact.findById(_id).lean()   
if(!contacts) return {notFound : true}

return {
props : {contacts : JSON.parse(JSON.stringify(contacts))}
}  
}
catch(error){
return {notFound : true}
}
}











