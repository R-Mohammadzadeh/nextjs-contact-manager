import MyNavbar from "@/components/navbar/navbar";
import "@/styles/globals.css";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import Loader from '../components/loader/Loader.jsx'
export default function App({ Component, pageProps }) {

const router = useRouter()

const [loading , setLoading] = useState(false)

useEffect(() => {
  // Funktion, die beim Seitenwechsel ausgeführt wird
  const handelStart = () => setLoading(true) ;
  // Funktion, die nach Abschluss des Seitenwechsels ausgeführt werden soll
  const handleComplete = () => setLoading(false)
router.events.on('hashChangeStart' , handelStart)
router.events.on('hashChangeComplete' ,handleComplete)
router.events.on('routeChangeError' , handleComplete)
} , [router])

  return (
    <>
    <MyNavbar />
    {loading && <Loader />}
    <Component {...pageProps} />
    </>
  )
}
