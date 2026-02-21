import styles from "@/styles/Home.module.css";
import Link from "next/link";
import { HiUsers, HiUserAdd } from "react-icons/hi";

export default function Home() {
  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <h1>Contact Management System</h1>
        <p>Manage your professional network efficiently</p>
      </header>

      <div className={styles.grid}>
        <Link href="/contacts" className={styles.card}>
          <HiUsers className={styles.icon} />
          <h3>View Contacts</h3>
          <p>Access and manage your full list of contacts</p>
        </Link>

        <Link href="/contacts/add" className={styles.card}>
          <HiUserAdd className={styles.icon} />
          <h3>Add New</h3>
          <p>Create a new contact entry in the database</p>
        </Link>
      </div>

      <footer className={styles.footer}>
        <p>Built with Next.js & MongoDB</p>
      </footer>
    </div>
  );
}