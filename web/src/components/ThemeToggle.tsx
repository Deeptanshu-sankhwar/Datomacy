"use client";

import { useState, useEffect } from "react";
import { Moon, Sun } from "lucide-react";

export function ThemeToggle() {
  const [isDark, setIsDark] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);

  useEffect(() => {
    const savedTheme = localStorage.getItem('theme');
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    const shouldBeDark = savedTheme === 'dark' || (!savedTheme && prefersDark);
    
    setIsDark(shouldBeDark);
    if (shouldBeDark) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, []);

  const toggleTheme = () => {
    if (isAnimating) return;
    
    setIsAnimating(true);
    
    setTimeout(() => {
      const newTheme = !isDark;
      setIsDark(newTheme);
      
      if (newTheme) {
        document.documentElement.classList.add('dark');
        localStorage.setItem('theme', 'dark');
      } else {
        document.documentElement.classList.remove('dark');
        localStorage.setItem('theme', 'light');
      }
      
      setTimeout(() => setIsAnimating(false), 300);
    }, 150);
  };

  return (
    <button
      onClick={toggleTheme}
      className={`
        relative w-8 h-8 rounded-lg transition-all duration-300 ease-in-out
        ${isDark ? 'bg-primary' : 'bg-muted'}
        hover:scale-105 active:scale-95
        focus:outline-none focus:ring-2 focus:ring-primary/50
        shadow-md border border-border/50
        flex items-center justify-center
        group
      `}
      aria-label={`Switch to ${isDark ? 'light' : 'dark'} mode`}
    >
      {/* Sweep Animation Background */}
      <div 
        className={`
          absolute inset-0 rounded-lg transition-all duration-500 ease-in-out
          ${isAnimating ? 'bg-gradient-to-r from-primary via-accent to-primary' : ''}
          ${isDark ? 'opacity-100' : 'opacity-0'}
        `}
        style={{
          background: isAnimating 
            ? 'linear-gradient(90deg, var(--primary), var(--accent), var(--primary))'
            : 'transparent'
        }}
      />
      
      {/* Icon Container with Smooth Transitions and Spin Effects */}
      <div className="relative z-10 w-4 h-4 flex items-center justify-center">
        <div className="relative w-full h-full">
          {/* Sun Icon */}
          <Sun 
            className={`
              absolute inset-0 w-4 h-4 transition-all duration-500 ease-in-out
              group-hover:rotate-180 group-active:rotate-360
              ${isDark 
                ? 'opacity-0 rotate-180 scale-75' 
                : 'opacity-100 rotate-0 scale-100'
              }
            `}
            style={{ 
              color: isDark ? 'transparent' : 'var(--foreground)',
              transition: 'all 0.5s cubic-bezier(0.4, 0, 0.2, 1), transform 0.3s ease-in-out'
            }}
          />
          
          {/* Moon Icon */}
          <Moon 
            className={`
              absolute inset-0 w-4 h-4 transition-all duration-500 ease-in-out
              group-hover:-rotate-180 group-active:-rotate-360
              ${isDark 
                ? 'opacity-100 rotate-0 scale-100' 
                : 'opacity-0 -rotate-180 scale-75'
              }
            `}
            style={{ 
              color: isDark ? 'white' : 'transparent',
              transition: 'all 0.5s cubic-bezier(0.4, 0, 0.2, 1), transform 0.3s ease-in-out'
            }}
          />
        </div>
      </div>
    </button>
  );
}
