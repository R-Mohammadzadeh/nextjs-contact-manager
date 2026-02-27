import { useContext, useState } from "react";
import { FaRegEye, FaRegEyeSlash } from "react-icons/fa";
import styles from "@/styles/login.module.css";
import Link from "next/link";
import toast from "react-hot-toast";
import { useRouter } from "next/router";
import { AppContext } from "../_app";
import validateToken from "@/utils/auth";

export default function Login() {
  const router = useRouter();
  const { setIsAuth, setUser } = useContext(AppContext);

  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({ email: "", password: "" });

  const inputHandler = e =>
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));

  const loginHandlerBtn = async e => {
    e.preventDefault();
    if (!formData.email || !formData.password)
      return toast.error("Please fill all fields");

    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await res.json();
      if (!res.ok) return toast.error(data.message || "Login failed");

      toast.success(data.message);
      setIsAuth(true);
      setUser?.(data.user);
      router.replace("/dashboard");
    } catch (err) {
      toast.error(err.message);
    }
  };

  return (
    <div className={styles.container}>
      <form onSubmit={loginHandlerBtn}>
        <input
          type="email"
          name="email"
          placeholder="Email"
          className={styles.inputField}
          value={formData.email}
          onChange={inputHandler}
        />

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

        <button className={styles.submitBtn}>Login</button>

        <div className={styles.message}>
          Not registered? <Link href="/auth/register">Create account</Link>
        </div>
      </form>
    </div>
  );
}

// ================= SERVER SIDE =================

export async function getServerSideProps(context) {
  return validateToken(context)
    ? { redirect: { destination: "/dashboard", permanent: false } }
    : { props: {} };
}