import { useState } from "react";
import { FaRegEye, FaRegEyeSlash, FaSpinner } from "react-icons/fa";
import styles from "@/styles/register.module.css";
import Link from "next/link";
import toast from "react-hot-toast";
import { useRouter } from "next/router";

export default function Register() {
  const router = useRouter();
  const INITIAL = { firstName: "", lastName: "", email: "", password: "" };

  const [formData, setFormData] = useState(INITIAL);
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const inputHandler = e =>
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));

  const subHandler = async e => {
    e.preventDefault();
    if (!formData.email || !formData.password)
      return toast.error("Please fill in all fields");

    setLoading(true);
    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message);

      toast.success(data.message);
      setFormData(INITIAL);
      router.replace("/auth/login");
    } catch (err) {
      toast.error(err.message || "Server connection failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.container}>
      <form onSubmit={subHandler}>
        <input name="firstName" placeholder="First name" value={formData.firstName} onChange={inputHandler} />
        <input name="lastName" placeholder="Last name" value={formData.lastName} onChange={inputHandler} />
        <input name="email" type="email" placeholder="Email" value={formData.email} onChange={inputHandler} />

        <div className={styles.password}>
          <input
            name="password"
            type={showPassword ? "text" : "password"}
            placeholder="Password"
            value={formData.password}
            onChange={inputHandler}
          />
          <span className={styles.eyes} onClick={() => setShowPassword(!showPassword)}>
            {showPassword ? <FaRegEyeSlash size="20" /> : <FaRegEye size="20" />}
          </span>
        </div>

        <button disabled={loading} className={styles.submitBtn}>
          {loading && <FaSpinner className={styles.spinner} size="20" />}
          Register
        </button>

        <div className={styles.message}>
          Already registered? <Link href="/auth/login">Login</Link>
        </div>
      </form>
    </div>
  );
}