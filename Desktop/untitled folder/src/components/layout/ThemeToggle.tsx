"use client";

import { motion } from "framer-motion";
import { Moon, Sun } from "lucide-react";
import { useTheme } from "./ThemeProvider";

export default function ThemeToggle() {
  const { theme, toggleTheme } = useTheme();

  return (
    <motion.button
      onClick={toggleTheme}
      className="fixed bottom-6 left-6 z-[100] flex h-14 w-14 items-center justify-center overflow-hidden rounded-full border border-[var(--glass-border)] bg-[var(--glass-bg)] text-[var(--text-primary)] shadow-[0_14px_40px_rgba(37,99,235,0.16)] backdrop-blur-2xl transition-all duration-500 hover:border-[var(--accent-primary)]"
      whileHover={{ scale: 1.08, y: -1 }}
      whileTap={{ scale: 0.94 }}
      aria-label="Toggle theme"
      aria-pressed={theme === "light"}
    >
      <motion.div
        className="absolute inset-0 rounded-full bg-[var(--accent-primary)] opacity-10 blur-2xl"
        animate={{ opacity: theme === "light" ? 0.14 : 0.1, scale: theme === "light" ? 1.06 : 1 }}
        transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
      />
      
      <motion.div
        initial={false}
        className="absolute"
        animate={{
          rotate: theme === "dark" ? 0 : -90,
          scale: theme === "dark" ? 1 : 0.7,
          opacity: theme === "dark" ? 1 : 0,
          y: theme === "dark" ? 0 : 6,
        }}
        transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
      >
        <Moon size={20} className="fill-current" />
      </motion.div>

      <motion.div
        initial={false}
        className="absolute"
        animate={{
          rotate: theme === "light" ? 0 : 90,
          scale: theme === "light" ? 1 : 0.7,
          opacity: theme === "light" ? 1 : 0,
          y: theme === "light" ? 0 : -6,
        }}
        transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
      >
        <Sun size={20} className="fill-current" />
      </motion.div>
    </motion.button>
  );
}
