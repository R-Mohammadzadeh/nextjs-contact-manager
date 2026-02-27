import styles from "@/styles/Home.module.css";
import Link from "next/link";
import { HiUsers, HiUserAdd, HiArrowRight } from "react-icons/hi";
import { useContext } from "react";
import { AppContext } from "./_app";

export default function Home() {
  const { isAuth, user } = useContext(AppContext);

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <h1>Contact Management System</h1>
        <p>
          {isAuth
            ? `Welcome back, ${user?.firstName}! Manage your network.`
            : "Manage your professional network efficiently"}
        </p>
      </header>

      <div className={styles.grid}>
        <Link href="/contacts" className={styles.card}>
          <HiUsers className={styles.icon} />
          <h3>View Contacts</h3>
          <p>Access and manage your full list of contacts</p>
        </Link>

        <Link
          href={isAuth ? "/dashboard" : "/auth/login"}
          className={styles.card}
        >
          {isAuth ? <HiArrowRight className={styles.icon} /> : <HiUserAdd className={styles.icon} />}
          <h3>{isAuth ? "Go to Dashboard" : "Get Started"}</h3>
          <p>
            {isAuth
              ? "View your personalized stats and profile"
              : "Login or create an account to manage contacts"}
          </p>
        </Link>
      </div>

      <footer className={styles.footer}>
        <p>Built with Next.js & MongoDB.</p>
      </footer>
    </div>
  );
}