'use client';

import React from 'react';
import { Sun, Moon } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';

const ThemeToggle: React.FC = () => {
  const { theme, toggleTheme } = useTheme();

  return (
    <button
      onClick={toggleTheme}
      className="fixed top-2 right-2 md:top-4 md:right-4 p-2 border group transition-all duration-100
        dark:border-white dark:hover:bg-white dark:hover:text-black
        border-black hover:bg-black hover:text-white z-50"
    >
      {theme === 'dark' ? (
        <div className="relative">
          <Sun className="w-5 h-5" />
          <Sun className="w-5 h-5 absolute -left-0.5 -top-0.5 opacity-60 text-red-500 group-hover:translate-x-1 transition-transform" />
          <Sun className="w-5 h-5 absolute -left-0.5 top-0.5 opacity-60 text-blue-500 group-hover:-translate-x-1 transition-transform" />
        </div>
      ) : (
        <div className="relative">
          <Moon className="w-5 h-5" />
          <Moon className="w-5 h-5 absolute -left-0.5 -top-0.5 opacity-60 text-red-500 group-hover:translate-x-1 transition-transform" />
          <Moon className="w-5 h-5 absolute -left-0.5 top-0.5 opacity-60 text-blue-500 group-hover:-translate-x-1 transition-transform" />
        </div>
      )}
    </button>
  );
};

export default ThemeToggle;