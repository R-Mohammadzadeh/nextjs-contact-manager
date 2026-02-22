import MyNavbar from "@/components/navbar/navbar";
// import "@/styles/globals.css";
// import 'nprogress/nprogress.css';
// import "@/styles/globals.css";
// import { useRouter } from "next/router";
// import { useEffect } from "react";



// NProgress.configure({ showSpinner: false, speed: 500, minimum: 0.3 });

export default function App({ Component, pageProps }) {
// const router = useRouter();

// useEffect(() => {
//     const handleStart = () => NProgress.start();
//     const handleStop = () => NProgress.done();

//     router.events.on('routeChangeStart', handleStart);
//     router.events.on('routeChangeComplete', handleStop);
//     router.events.on('routeChangeError', handleStop);

//     return () => {
//       router.events.off('routeChangeStart', handleStart);
//       router.events.off('routeChangeComplete', handleStop);
//       router.events.off('routeChangeError', handleStop);
//     };
//   }, [router]);


  return (
    <>
    <MyNavbar />
    <Component {...pageProps} />
    </>
  )
}
