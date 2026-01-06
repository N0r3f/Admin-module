import { useState } from 'react';
import styles from '../../styles/Layout.module.css';

export default function MainLayout({ children }) {
  const [darkMode, setDarkMode] = useState(true);

  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
  };

  return (
    <div className={`${styles.layoutContainer} ${darkMode ? styles.darkLayout : styles.lightLayout}`}>
      <main className={styles.mainContent}>
        {children}
      </main>
      <footer className={styles.footer}>
        <button 
          className={styles.themeSwitcher}
          onClick={toggleDarkMode}
        >
          {darkMode ? 'Light Mode' : 'Dark Mode'}
        </button>
        <span>@n0r3f</span>
      </footer>
    </div>
  );
}
