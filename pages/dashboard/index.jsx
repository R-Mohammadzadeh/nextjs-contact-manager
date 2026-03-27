import { useState, useEffect, useContext } from "react";
import styles from "@/styles/dashboard.module.css";
import connectDB from "@/utils/connectDB";
import User from "@/models/User";
import validateToken from "@/utils/auth";
import { useRouter } from "next/router";
import { AppContext } from "@/pages/_app";
import toast from "react-hot-toast";

export default function Dashboard({ user }) {
  const router = useRouter();
  const { setIsAuth, setUser } = useContext(AppContext);
  
  // State for live clock and date
  const [currentTime, setCurrentTime] = useState("");
  const [currentDate, setCurrentDate] = useState("");

  useEffect(() => {
    // Update clock every second
    const timer = setInterval(() => {
      const now = new Date();
      
      // Format time (HH:mm:ss)
      setCurrentTime(now.toLocaleTimeString("de-DE"));
      
      // Format date (e.g., Montag, 27. März 2026)
      setCurrentDate(now.toLocaleDateString("de-DE", {
        weekday: 'long', 
        year: 'numeric', 
        month: 'long', 
        day: 'numeric'
      }));
    }, 1000);

    return () => clearInterval(timer); // Cleanup on unmount
  }, []);

  const logoutHandler = async () => {
    try {
      const res = await fetch("/api/auth/logout", {
        headers: { "Cache-Control": "no-cache" }
      });

      if (res.ok) {
        setIsAuth(false);
        setUser(null);
        toast.success("Logged out successfully");
        router.push("/auth/login"); 
      }
    } catch (error) {
      toast.error("Logout failed");
    }
  };

  return (
    <div className={styles.wrapper}>
      {/* Sidebar Section */}
      <aside className={styles.sidebar}>
        <div className={styles.sidebarLogo}>
          <h2>Mein Panel</h2>
        </div>
        <ul className={styles.navLinks}>
          <li className={styles.active}>Profil</li>
          <li>Einstellungen</li>
          <li className={styles.logout} onClick={logoutHandler}>
            Logout
          </li>
        </ul>
      </aside>

      {/* Main Content Section */}
      <main className={styles.content}>
        <header className={styles.header}>
          <div className={styles.welcomeText}>
            <h1>Willkommen, {user?.firstName || "User"}!</h1>
            <p className={styles.dateDisplay}>{currentDate}</p>
          </div>
          <div className={styles.clockDisplay}>
            {currentTime}
          </div>
        </header>

        {/* Stats Grid */}
        <div className={styles.statsGrid}>
          <div className={styles.card}>
            <div className={styles.cardIcon}></div>
            <h3>Status</h3>
            <p className={styles.statusBadge}>
              {user?.role === "admin" ? "Administrator" : "Benutzer"}
            </p>
          </div>

          <div className={styles.card}>
            <div className={styles.cardIcon}></div>
            <h3>Letzter Login</h3>
            <p>Heute, {new Date().toLocaleDateString("de-DE")}</p>
          </div>

          <div className={styles.card}>
            <div className={styles.cardIcon}></div>
            <h3>Email</h3>
            <p>{user?.email || "Nicht verfügbar"}</p>
          </div>
        </div>
      </main>
    </div>
  );
}

// Server-side authentication and data fetching
export async function getServerSideProps(context) {
  const payload = validateToken(context);
  
  if (!payload) {
    return {
      redirect: { destination: "/auth/login", permanent: false },
    };
  }

  await connectDB();
  
  // Fetch user data from DB
  const dbUser = await User.findById(payload._id)
    .select("firstName lastName role email")
    .lean();

  return {
    props: {
      user: dbUser ? JSON.parse(JSON.stringify(dbUser)) : null,
    },
  };
}