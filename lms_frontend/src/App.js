import React, { useEffect, useState } from 'react';
import './App.css';

/**
 * App is a minimal theming wrapper retained for compatibility.
 * Real routing is handled in src/router.jsx.
 */
// PUBLIC_INTERFACE
function App({ children }) {
  const [theme, setTheme] = useState('light');
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
  }, [theme]);

  // PUBLIC_INTERFACE
  const toggleTheme = () => setTheme(t => (t === 'light' ? 'dark' : 'light'));

  return (
    <div className="App">
      <header className="App-header" style={{ minHeight: 'auto', padding: '0.5rem 1rem', display: 'flex', justifyContent: 'flex-end' }}>
        <button className="theme-toggle" onClick={toggleTheme} aria-label={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}>
          {theme === 'light' ? '🌙 Dark' : '☀️ Light'}
        </button>
      </header>
      {children}
    </div>
  );
}

export default App;
