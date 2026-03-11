import MyNavbar from "@/components/navbar/navbar";
import { createContext, useEffect, useMemo, useState } from "react";
import { Toaster } from "react-hot-toast";
import styles from "@/styles/app.module.css";
import { ThemeProvider } from "next-themes";


export const AppContext = createContext();
export default function App({ Component, pageProps }) {

  const [isAuth, setIsAuth] = useState(false);
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
const [isOpen , setIsOpen] = useState(false)





 useEffect(() => {
    let mounted = true;

    (async () => {
      try {
        const res = await fetch("/api/auth/status");
        const data = await res.json();
        
        if (!mounted) return;

        // Check if authentication was successful
        // We look for 'payload' as defined in your API
        if (res.status === 200 && data.payload) {
          setIsAuth(true);
          setUser(data.payload); 
        } else {
          setIsAuth(false);
          setUser(null);
        }
      } catch (error) {
        console.error("Auth initialization failed:", error);
        if (mounted) {
          setIsAuth(false);
          setUser(null);
        }
      } finally {
        if (mounted) setIsLoading(false);
      }
    })();

    return () => (mounted = false);
  }, []);
  const contextValue = useMemo(
    () => ({ isAuth, setIsAuth, user, setUser, isLoading , setIsOpen , isOpen }),
    [isAuth, user, isLoading , isOpen]
  );

  return (
    <AppContext.Provider value={contextValue}>
    <ThemeProvider attribute='data-theme' defaultTheme="system" enableSystem>
    <Toaster position="top-right" />
      {!isLoading && <MyNavbar />}

      {isLoading ? (
        <div className={styles.loaderContainer}>
          <span className={styles.loader}></span>
        </div>
      ) : (
        <Component {...pageProps} />
      )}
</ThemeProvider>
    
    </AppContext.Provider>
  );
}