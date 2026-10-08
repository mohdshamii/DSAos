import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './index.css';

// Apply saved theme on boot
const savedTheme = localStorage.getItem('dsaos_settings');
if (savedTheme) {
  try {
    const parsed = JSON.parse(savedTheme);
    if (parsed.theme === 'light') {
      document.documentElement.classList.remove('dark');
    } else {
      document.documentElement.classList.add('dark');
    }
  } catch (e) {
    document.documentElement.classList.add('dark');
  }
} else {
  document.documentElement.classList.add('dark');
}

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
