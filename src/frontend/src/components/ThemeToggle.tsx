import React from 'react';
import { useTheme } from '../context/ThemeContext';
import { IconButton, useColorModeValue } from '@chakra-ui/react';
import { MoonIcon, SunIcon } from '@chakra-ui/icons';

export const ThemeToggle: React.FC = () => {
  const { theme, toggleTheme } = useTheme();
  const bgHover = useColorModeValue('gray.200', 'gray.700');

  return (
    <IconButton
      aria-label={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
      icon={theme === 'light' ? <MoonIcon /> : <SunIcon />}
      onClick={toggleTheme}
      variant="ghost"
      _hover={{ bg: bgHover }}
      size="lg"
      rounded="full"
    />
  );
}; 