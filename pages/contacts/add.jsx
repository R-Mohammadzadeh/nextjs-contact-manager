import { useEffect, useRef, useState } from "react";
import toast, { Toaster } from "react-hot-toast";
import styles from '@/styles/add-contact.module.css';
import { ImSpinner3 } from "react-icons/im";
import validateToken from "@/utils/auth";

const INITIAL_STATE = { firstName: '', lastName: '', age: '', phone: '', gender: '' };

export default function AddContacts({userId}) {
  const [form, setForm] = useState(INITIAL_STATE);
  const [loading, setLoading] = useState(false);
  const inputRef = useRef();

  useEffect(() => { inputRef.current?.focus(); }, []);

  const handleChange = e => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  };

  const validateForm = ({firstName , lastName , age , phone , gender}) => {

  firstName = firstName?.trim() ;
  lastName = lastName?.trim() ;
  phone = phone?.trim() ; 
   
 if (!firstName && !lastName && !age && !phone && !gender) {
    return "All fields are required";
  }

if(!firstName) return "First name is required";
if(firstName.length < 2) return "First name too short";

if(!lastName) return "Last name is required";
if(lastName.length < 2) return "Last name too short";

if(!age) return "Age is required";
if(isNaN(age) || Number(age) < 18 ) return "Age must be 18+";

if (!gender) return "Please select gender";

if(!phone) return "Phone required";
if(!/^[0-9]{10,15}$/.test(phone)) return "Phone invalid";

return null
  };

  const handleSubmit = async e => {
    e.preventDefault();
    
    const error = validateForm(form)
    if(error) {
      toast.error(error)
      return ;
    }

    setLoading(true);
    try {
      const res = await fetch('/api/contacts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...form, age: Number(form.age) , userId })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Server error');

      toast.success('Contact added successfully!');
      setForm(INITIAL_STATE);
      inputRef.current.focus();
    } catch (err) {
      toast.error(err.message || 'Could not connect to server');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Toaster position="top-right" />
      <div className={styles.container}>
        <form onSubmit={handleSubmit}>
          <input ref={inputRef} name="firstName" value={form.firstName} onChange={handleChange} placeholder="First Name" />
          <input name="lastName" value={form.lastName} onChange={handleChange} placeholder="Last Name" />
          <input name="age" type="number" min="18" value={form.age} onChange={handleChange} placeholder="Age" />
          <select name="gender" value={form.gender} onChange={handleChange}>
            <option value="" disabled hidden>Select Gender</option>
            <option value="male">Male</option>
            <option value="female">Female</option>
            <option value="others">Others</option>
          </select>
          <input name="phone" value={form.phone} onChange={handleChange} placeholder="Phone" />
          <button type="submit" disabled={loading}>
            {loading ? <ImSpinner3 className={styles.spin} /> : 'Add Contact'}
          </button>
        </form>
      </div>
    </>
  );
}

// ================= SERVER-SIDE AUTH =================

export async function getServerSideProps(context) {
  const payload = validateToken(context);
  if (!payload) return { redirect: { destination: '/auth/login', permanent: false } };
  return { 
    props :{
    userId : payload._id || payload.userId || null
  } };
}