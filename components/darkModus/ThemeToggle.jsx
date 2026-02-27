import { useTheme } from 'next-themes'
import { useEffect, useState } from 'react'
import { IoMoon, IoSunny } from "react-icons/io5"
import styles from "./ThemeToggle.module.css"

export default function ThemeToggle() {
  const { resolvedTheme, setTheme } = useTheme()
  const [mounted, setMounted] = useState(false)

  useEffect(() => setMounted(true), [])

  if (!mounted) return <div style={{ width: '30px' }}></div> 

  return (
    <button 
      className={styles.themeBtn}
      onClick={() => setTheme(resolvedTheme === 'dark' ? 'light' : 'dark')}
    >
      {resolvedTheme === 'dark' ? (<IoSunny size="22px" color="#ffcf40" />) : (<IoMoon size="22px" color="#4a4a4a" />)}
    </button>
  )
}