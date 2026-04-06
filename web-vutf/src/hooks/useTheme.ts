// src/hooks/useTheme.ts
import { useEffect, useState } from "react";

export function useTheme() {
  // อ่านค่าจาก LocalStorage ถ้าไม่มีให้ default เป็น 'light'
  const [theme, setTheme] = useState(
    localStorage.getItem("theme") || "light"
  );

  useEffect(() => {
    const root = window.document.documentElement;
    
    // ลบ class เก่าและใส่ class ใหม่
    root.classList.remove("light", "dark");
    root.classList.add(theme);
    
    // บันทึกค่า
    localStorage.setItem("theme", theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme((prev) => (prev === "light" ? "dark" : "light"));
  };

  return { theme, toggleTheme };
}