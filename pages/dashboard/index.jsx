import styles from "@/styles/dashboard.module.css";
import connectDB from "@/utils/connectDB";
import User from "@/models/User";
import validateToken from "@/utils/auth";
import { useRouter } from "next/router";
import { useContext } from "react"; // Added useContext
import { AppContext } from "@/pages/_app"; // Added AppContext
import toast from "react-hot-toast";

export default function Dashboard({ user }) {
  const router = useRouter();
  const { setIsAuth, setUser } = useContext(AppContext); // Use global state

  // Unified logout function
  const logoutHandler = async () => {
    try {
      const res = await fetch("/api/auth/logout" , {
        method: "POST",
        headers: {
          "Cache-Control": "no-cache",
        },
      });
      if (res.ok) {
        // Clear global authentication state
        setIsAuth(false);
        setUser(null);
        toast.success("Logged out successfully");
        
       await router.replace("/auth/login");
      }else {
        toast.error("server error during logout process ");
      }
    } catch (error) {
      console.error("Logout failed:", error);
      toast.error("Logout failed");
    }
  };

  return (
    <div className={styles.wrapper}>
      <aside className={styles.sidebar}>
        <h2>Mein Panel</h2>
        <ul>
          <li>Profil</li>
          <li>Einstellungen</li>
          <li className={styles.logout} onClick={logoutHandler} style={{ cursor: 'pointer' }}>
            Logout
          </li>
        </ul>
      </aside>

      <main className={styles.content}>
        <header className={styles.header}>
          <h1>
            Willkommen, {user?.firstName || "User"} {user?.lastName || ""}!
          </h1>
        </header>

        <div className={styles.statsGrid}>
          <div className={styles.card}>
            <h3>Status</h3>
            <p>{user?.role === "admin" ? "Administrator" : "Benutzer"}</p>
          </div>
          <div className={styles.card}>
            <h3>Letzter Login</h3>
            <p>Heute</p>
          </div>
        </div>
      </main>
    </div>
  );
}

// Server-side authentication
export async function getServerSideProps(context) {
  const payload = validateToken(context);
  if (!payload) {
    return { redirect: { destination: "/auth/login", permanent: false } };
  }

  await connectDB();
  const user = await User.findById(payload._id).select("firstName lastName role").lean();

  const finalUser = user 
    ? JSON.parse(JSON.stringify(user))
    : { firstName: payload.firstName || "User", role: "user" };

  return { props: { user: finalUser } };
}