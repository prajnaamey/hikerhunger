import React, { createContext, useContext, useEffect } from 'react';
import { useColorMode } from '@chakra-ui/react';

type Theme = 'light' | 'dark';

interface ThemeContextType {
  theme: Theme;
  toggleTheme: () => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { colorMode, setColorMode } = useColorMode();

  useEffect(() => {
    // Check if user has a saved preference
    const savedTheme = localStorage.getItem('chakra-ui-color-mode');
    if (savedTheme === 'light' || savedTheme === 'dark') {
      setColorMode(savedTheme);
    } else {
      // Check system preference
      const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      setColorMode(prefersDark ? 'dark' : 'light');
    }
  }, [setColorMode]);

  const toggleTheme = () => {
    const newTheme = colorMode === 'light' ? 'dark' : 'light';
    setColorMode(newTheme);
  };

  return (
    <ThemeContext.Provider value={{ theme: colorMode as Theme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
}; 