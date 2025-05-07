import React from 'react';
import {
  Box,
  Container,
  Flex,
  Heading,
  Button,
  useColorModeValue,
  HStack,
} from '@chakra-ui/react';
import { useNavigate, useLocation } from 'react-router-dom';
import { ThemeToggle } from './ThemeToggle';

interface LayoutProps {
  children: React.ReactNode;
}

export const Layout: React.FC<LayoutProps> = ({ children }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const bgColor = useColorModeValue('white', 'gray.800');
  const borderColor = useColorModeValue('gray.200', 'whiteAlpha.200');
  const textColor = useColorModeValue('gray.800', 'whiteAlpha.900');

  const isActive = (path: string) => location.pathname === path;

  return (
    <Box minH="100vh" display="flex" flexDirection="column">
      {/* Header */}
      <Box
        as="header"
        position="sticky"
        top={0}
        zIndex={10}
        bg={bgColor}
        borderBottom="1px"
        borderColor={borderColor}
        py={4}
      >
        <Container maxW="container.xl">
          <Flex justify="space-between" align="center">
            <HStack spacing={8}>
              <Heading
                size="md"
                color="brand.500"
                cursor="pointer"
                onClick={() => navigate('/')}
              >
                HikerHunger
              </Heading>
              <Button
                variant="ghost"
                onClick={() => navigate('/')}
                colorScheme={isActive('/') ? 'brand' : undefined}
              >
                Home
              </Button>
              <Button
                variant="ghost"
                onClick={() => navigate('/calculate')}
                colorScheme={isActive('/calculate') ? 'brand' : undefined}
              >
                Advanced Calculator
              </Button>
              <Button
                variant="ghost"
                onClick={() => navigate('/about')}
                colorScheme={isActive('/about') ? 'brand' : undefined}
              >
                About
              </Button>
            </HStack>
            <ThemeToggle />
          </Flex>
        </Container>
      </Box>

      {/* Main Content */}
      <Box flex="1">
        {children}
      </Box>

      {/* Footer */}
      <Box
        as="footer"
        bg={useColorModeValue('gray.50', 'gray.900')}
        borderTop="1px"
        borderColor={borderColor}
        py={6}
      >
        <Container maxW="container.xl">
          <Flex justify="space-between" align="center">
            <Box color={textColor}>
              © {new Date().getFullYear()} HikerHunger. All rights reserved.
            </Box>
            <HStack spacing={4}>
              <Button variant="link" colorScheme="brand" onClick={() => navigate('/calculate')}>
                Advanced Calculator
              </Button>
            </HStack>
          </Flex>
        </Container>
      </Box>
    </Box>
  );
}; 