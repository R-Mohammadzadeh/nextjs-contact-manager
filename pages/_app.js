import MyNavbar from "@/components/navbar/navbar";
import "@/styles/globals.css";

export default function App({ Component, pageProps }) {
  return (
    <>
    <MyNavbar />
    <Component {...pageProps} />
    </>
  )
}
