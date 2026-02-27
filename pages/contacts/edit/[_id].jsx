import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/router";
import toast, { Toaster } from "react-hot-toast";
import styles from '@/styles/add-contact.module.css';
import { ImSpinner3 } from "react-icons/im";
import connectDB from "@/utils/connectDB";
import Contact from "@/models/Contact";

export default function EditContact({ contacts }) {
  const router = useRouter();
  const [form, setForm] = useState(contacts || {});
  const [loading, setLoading] = useState(false);
  const inputRef = useRef();

  useEffect(() => { inputRef.current?.focus(); }, []);

  const handleChange = e => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async e => {
    e.preventDefault();
    if (loading) return;

    const required = ['firstName','lastName','age','gender','phone'];
    if (!required.every(f => String(form[f] || '').trim())) return toast.error('Please fill all fields');

    const rules = [
      { test: form.firstName.trim().length < 2, msg: 'First name too short' },
      { test: form.lastName.trim().length < 3, msg: 'Last name invalid' },
      { test: isNaN(form.age) || Number(form.age) < 18, msg: 'Invalid age' },
      { test: !/^[0-9]{10,15}$/.test(form.phone), msg: 'Invalid phone' },
    ];

    const error = rules.find(r => r.test);
    if (error) return toast.error(error.msg);

    setLoading(true);
    try {
      const res = await fetch(`/api/contact/${form._id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...form, age: Number(form.age) })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message);

      toast.success('Contact updated successfully');
      router.push('/contacts');
    } catch (err) {
      toast.error(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Toaster position="top-right" />
      <div className={styles.container}>
        <form onSubmit={handleSubmit}>
          <input ref={inputRef} name="firstName" value={form.firstName || ''} onChange={handleChange} placeholder="First Name" />
          <input name="lastName" value={form.lastName || ''} onChange={handleChange} placeholder="Last Name" />
          <input name="age" type="number" value={form.age || ''} onChange={handleChange} placeholder="Age" />
          <select name="gender" value={form.gender || ''} onChange={handleChange}>
            <option value="" hidden>Select gender</option>
            <option value="male">Male</option>
            <option value="female">Female</option>
            <option value="others">Others</option>
          </select>
          <input name="phone" value={form.phone || ''} onChange={handleChange} placeholder="Phone" />
          <button disabled={loading}>{loading ? <ImSpinner3 className={styles.spin} /> : 'Update Contact'}</button>
        </form>
      </div>
    </>
  );
}

// ================= SERVER-SIDE =================
export async function getServerSideProps({ params }) {
  await connectDB();
  try {
    const contact = await Contact.findById(params._id).lean();
    if (!contact) return { notFound: true };
    return { props: { contacts: JSON.parse(JSON.stringify(contact)) } };
  } catch {
    return { notFound: true };
  }
}