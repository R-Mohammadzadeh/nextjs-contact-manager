import styles from "@/styles/dashboard.module.css";
import connectDB from "@/utils/connectDB";
import User from "@/models/User";
import validateToken from "@/utils/auth";


export default function Dashboard({ user }) {
  return (
    <div className={styles.wrapper}>
      <aside className={styles.sidebar}>
        <h2>Mein Panel</h2>
        <ul>
          <li>Profil</li>
          <li>Einstellungen</li>
          <li className={styles.logout}>Logout</li>
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

export async function getServerSideProps(context) {
  const payload = validateToken(context);
  if (!payload)
    return { redirect: { destination: "/auth/login", permanent: false } };

  await connectDB();

  const user =
    (await User.findById(payload._id).select("firstName lastName role").lean()) 

const finalUser = user ? JSON.parse(JSON.stringify(user))
 : { firstName: payload.firstName || "User", role: "user" }

   

  return { props: { user  : finalUser} };
}