import Link from "next/link";
import styles from "./navbar.module.css";
import { IoClose, IoPersonAdd } from "react-icons/io5";
import { RiContactsBook3Fill } from "react-icons/ri";
import { FaHome } from "react-icons/fa";
import { LuLogIn, LuLogOut } from "react-icons/lu";
import { MdDashboardCustomize } from "react-icons/md";
import { useRouter } from "next/router";
import { useContext, useEffect } from "react";
import { AppContext } from "@/pages/_app";
import toast from "react-hot-toast";
import { RxHamburgerMenu } from "react-icons/rx";
import ThemeToggle from "../darkModus/ThemeToggle";





export default function MyNavbar() {
  const { isAuth, setIsAuth, setUser, isOpen, setIsOpen } = useContext(AppContext);
  const { route } = useRouter();



  
  const logOutHandler = async () => {
    try {
      const res = await fetch("/api/auth/logout");
      if (!res.ok) throw new Error();

      setIsAuth(false);
      setUser(null);
      setIsOpen(false); 
      toast.success("Logged out");
      window.location.replace("/auth/login");
    } catch {
      toast.error("Logout failed");
    }
  };

  const linkClass = (path) =>
    `${styles.link} ${route === path ? styles.active : ""}`;

  const closeMenu = () => setIsOpen(false);

useEffect(() => {
  document.body.style.overflow = isOpen ? 'hidden' : 'auto';
}, [isOpen]);

  return (

<>

  {!isOpen && (
    <div className={styles.hamburgerWrapper} onClick={() => setIsOpen(!isOpen)}>
      <RxHamburgerMenu size="30px" />
    </div>
  )}

  {isOpen && <div className={styles.overlay} onClick={closeMenu} />}

    <nav className={`${styles.offMenu} ${isOpen ? styles.offMenuOpen : ""}`}>
    
        <div className={styles.offHeader}>
         {isOpen && <IoClose size="30px" onClick={closeMenu} className={styles.mal} />}
        </div>

      <div className={styles.menu}>
        {isAuth ? (
          <button onClick={logOutHandler} className={styles.Btn}>
            <LuLogOut /> logout
          </button>
        ) : (
          <Link href="/auth/login" className={linkClass("/auth/login")} onClick={closeMenu}>
            <LuLogIn /> login
          </Link>
        )}

        <Link href="/" className={linkClass("/")} onClick={closeMenu}>
          <FaHome /> home
        </Link>

        <Link href="/contacts" className={linkClass("/contacts")} onClick={closeMenu}>
          <RiContactsBook3Fill /> contacts
        </Link>

        {isAuth && (
          <>
            <Link href="/contacts/add" className={linkClass("/contacts/add")} onClick={closeMenu}>
              <IoPersonAdd /> add contact
            </Link>
            <Link href="/dashboard" className={linkClass("/dashboard")} onClick={closeMenu}>
              <MdDashboardCustomize /> dashboard
            </Link>
          </>
        )}
      <div >
        < ThemeToggle className={styles.dark}/>
      </div>
      </div>
    </nav>
  
  </>);
}