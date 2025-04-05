import { useEffect, useState } from "react";
import { Moon, Sun } from "lucide-react"; // Import the icons from lucide-react

export default function DarkModeToggle() {
  const [darkMode, setDarkMode] = useState(
    localStorage.getItem("theme") === "dark" ||
      (!("theme" in localStorage) && window.matchMedia("(prefers-color-scheme: dark)").matches)
  );

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add("dark");
      localStorage.setItem("theme", "dark");
    } else {
      document.documentElement.classList.remove("dark");
      localStorage.setItem("theme", "light");
    }
  }, [darkMode]);

  return (
    <button
      className="p-2 rounded"
      onClick={() => setDarkMode(!darkMode)}
    >
      {/* Conditionally render icons based on darkMode state */}
      {darkMode ? <Moon size={30} /> : <Sun size={30} />}
    </button>
  );
}
