import Link from 'next/link'
import styles from './navbar.module.css'
import { IoPersonAdd } from "react-icons/io5";
import { RiContactsBook3Fill } from "react-icons/ri";
import { FaHome } from "react-icons/fa";
import { useRouter } from 'next/router';
import { LuLogIn  ,LuLogOut } from "react-icons/lu";
import { MdDashboardCustomize } from "react-icons/md";




export default function MyNavbar () {
    const { route } = useRouter()

    return (
        <nav className={styles.box}>
            <div className={styles.menu}>
                <Link href='/auth/login' 
                      className={`${styles.link} ${route === '/auth/login' ? styles.active : ''}`}>
                    <LuLogIn /> login
                </Link>
                
                <Link href='/contacts/add' 
                      className={`${styles.link} ${route === '/contacts/add' ? styles.active : ''}`}>
                    <IoPersonAdd /> add contact
                </Link>


                <Link href='/contacts' 
                      className={`${styles.link} ${route === '/contacts' ? styles.active : ''}`}>
                    <RiContactsBook3Fill /> contacts
                </Link>

                  <Link href='/dashboard' 
                      className={`${styles.link} ${route === '/dashboard' ? styles.active : ''}`}>
                    <MdDashboardCustomize /> dashbaord
                </Link>

                <Link href='/' 
                      className={`${styles.link} ${route === '/' ? styles.active : ''}`}>
                    <FaHome /> home
                </Link>
            </div>
        </nav>
    )
}