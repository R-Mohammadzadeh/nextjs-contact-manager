import { useEffect, useRef, useState } from "react";
import toast, { Toaster } from "react-hot-toast";
import styles from '@/styles/add-contact.module.css';
import { ImSpinner3 } from "react-icons/im";
import validateToken from "@/utils/auth";

const INITIAL_STATE = { firstName: '', lastName: '', age: '', phone: '', gender: '' };

export default function AddContacts() {
  const [form, setForm] = useState(INITIAL_STATE);
  const [loading, setLoading] = useState(false);
  const inputRef = useRef();

  useEffect(() => { inputRef.current?.focus(); }, []);

  const handleChange = e => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  };

  const validateForm = () => {
    const { firstName, lastName, age, phone, gender } = form;
    const rules = [
      // First Name Validation
      {test : !firstName?.trim() , msg :'First name is required'} ,
      {test :firstName?.trim() && firstName.trim().length < 2 , msg :'First name is too short (min 2 chars)' } ,
      // Last Name Validation
      {test : !lastName?.trim() , msg: 'Last name is required' } ,
      {test : lastName?.trim() && (lastName.trim().length < 2)} ,
      // Age Validation
      {test: !age , msg :'Age is required'} ,
      {test : age && (isNaN(age) || Number(age)) < 18 , msg :'Age must be a number and at least 18' } ,
      // Gender Validation
      {test : !gender, msg: 'Please select a gender' } ,
      // Phone Validation
      {test : !phone , msg : 'Phone number is required'} ,
      {test : phone && !/^[0-9]{10,15}$/.test(phone) , msg : 'Phone must be 10-15 digits'}
    ];
    // Find the first rule that is true (meaning there is an error)
    const error = rules.find(r => r.test);
    if (error) { toast.error(error.msg); return false; }
    return true;
  };

  const handleSubmit = async e => {
    e.preventDefault();
    if (!validateForm()) return;

    setLoading(true);
    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...form, age: Number(form.age) })
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
  return { props: {} };
}