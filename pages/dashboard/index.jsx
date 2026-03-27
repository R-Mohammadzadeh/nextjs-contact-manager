import styles from "@/styles/dashboard.module.css";
import connectDB from "@/utils/connectDB";
import User from "@/models/User";
import validateToken from "@/utils/auth";
import { useRouter } from "next/router"; // Import useRouter

export default function Dashboard({ user }) {

const router = useRouter(); // Initialize useRouter
  // Function to handle user logout
  const logoutHandler = async () => {
    try {
      const res = await fetch("/api/auth/logout");
      if (res.ok) {
        // Redirect to login page after successful logout
       router.replace("/auth/login")
      }
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  return (
    <div className={styles.wrapper}>
      <aside className={styles.sidebar}>
        <h2>Mein Panel</h2>
        <ul>
          <li>Profil</li>
          <li>Einstellungen</li>
          {/* Add onClick event here */}
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

// ================= SSR AUTH =================
// Your existing getServerSideProps is perfect as it is!
export async function getServerSideProps(context) {
  const payload = validateToken(context);
  if (!payload)
    return { redirect: { destination: "/auth/login", permanent: false } };

  await connectDB();

  const user = await User.findById(payload._id).select("firstName lastName role").lean();

  const finalUser = user 
    ? JSON.parse(JSON.stringify(user))
    : { firstName: payload.firstName || "User", role: "user" };

  return { props: { user: finalUser } };
}