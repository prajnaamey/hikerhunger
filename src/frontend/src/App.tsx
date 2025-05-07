import React from 'react';
import { ChakraProvider, extendTheme, ColorModeScript } from '@chakra-ui/react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { LandingPage, CalorieCalculator } from './components';
import About from './components/About';
import { ThemeProvider } from './context/ThemeContext';
import { ThemeToggle } from './components/ThemeToggle';

const theme = extendTheme({
  colors: {
    brand: {
      50: '#f0fff4',
      100: '#c6f6d5',
      200: '#9ae6b4',
      300: '#68d391',
      400: '#48bb78',
      500: '#38a169',
      600: '#2f855a',
      700: '#276749',
      800: '#22543d',
      900: '#1c4532',
    },
  },
  fonts: {
    heading: `'Inter', 'Segoe UI', 'Helvetica Neue', Arial, sans-serif`,
    body: `'Inter', 'Segoe UI', 'Helvetica Neue', Arial, sans-serif`,
  },
  config: {
    initialColorMode: 'system',
    useSystemColorMode: true,
  },
  styles: {
    global: (props: any) => ({
      body: {
        bg: props.colorMode === 'dark' ? 'gray.900' : 'white',
        color: props.colorMode === 'dark' ? 'whiteAlpha.900' : 'gray.800',
      },
    }),
  },
  components: {
    Button: {
      baseStyle: (props: any) => ({
        _hover: {
          bg: props.colorMode === 'dark' ? 'whiteAlpha.200' : 'gray.100',
        },
      }),
      variants: {
        solid: (props: any) => ({
          bg: props.colorMode === 'dark' ? 'brand.500' : 'brand.500',
          color: 'white',
          _hover: {
            bg: props.colorMode === 'dark' ? 'brand.600' : 'brand.600',
          },
        }),
        outline: (props: any) => ({
          borderColor: props.colorMode === 'dark' ? 'whiteAlpha.300' : 'gray.200',
          color: props.colorMode === 'dark' ? 'whiteAlpha.900' : 'gray.700',
          _hover: {
            bg: props.colorMode === 'dark' ? 'whiteAlpha.100' : 'gray.50',
          },
        }),
      },
    },
    Input: {
      baseStyle: (props: any) => ({
        field: {
          bg: props.colorMode === 'dark' ? 'whiteAlpha.100' : 'white',
          borderColor: props.colorMode === 'dark' ? 'whiteAlpha.300' : 'gray.200',
          transition: 'all 0.2s ease-in-out',
          _hover: {
            borderColor: props.colorMode === 'dark' ? 'whiteAlpha.400' : 'gray.300',
            transform: 'translateY(-1px)',
          },
          _focus: {
            borderColor: 'brand.500',
            boxShadow: `0 0 0 1px ${props.colorMode === 'dark' ? 'brand.500' : 'brand.500'}, 0 0 8px ${props.colorMode === 'dark' ? 'brand.500' : 'brand.300'}`,
            transform: 'translateY(-1px)',
          },
        },
      }),
    },
    Select: {
      baseStyle: (props: any) => ({
        field: {
          bg: props.colorMode === 'dark' ? 'whiteAlpha.100' : 'white',
          borderColor: props.colorMode === 'dark' ? 'whiteAlpha.300' : 'gray.200',
          transition: 'all 0.2s ease-in-out',
          _hover: {
            borderColor: props.colorMode === 'dark' ? 'whiteAlpha.400' : 'gray.300',
            transform: 'translateY(-1px)',
          },
          _focus: {
            borderColor: 'brand.500',
            boxShadow: `0 0 0 1px ${props.colorMode === 'dark' ? 'brand.500' : 'brand.500'}, 0 0 8px ${props.colorMode === 'dark' ? 'brand.500' : 'brand.300'}`,
            transform: 'translateY(-1px)',
          },
        },
        icon: {
          color: props.colorMode === 'dark' ? 'whiteAlpha.900' : 'gray.600',
        },
      }),
      variants: {
        filled: (props: any) => ({
          field: {
            bg: props.colorMode === 'dark' ? 'whiteAlpha.50' : 'gray.50',
            _hover: {
              bg: props.colorMode === 'dark' ? 'whiteAlpha.100' : 'gray.100',
            },
            _focus: {
              bg: props.colorMode === 'dark' ? 'whiteAlpha.100' : 'white',
            },
          },
        }),
      },
    },
    FormLabel: {
      baseStyle: (props: any) => ({
        color: props.colorMode === 'dark' ? 'whiteAlpha.900' : 'gray.700',
        fontWeight: 'medium',
        mb: 2,
      }),
    },
    NumberInput: {
      baseStyle: (props: any) => ({
        field: {
          bg: props.colorMode === 'dark' ? 'whiteAlpha.100' : 'white',
          borderColor: props.colorMode === 'dark' ? 'whiteAlpha.300' : 'gray.200',
          transition: 'all 0.2s ease-in-out',
          _hover: {
            borderColor: props.colorMode === 'dark' ? 'whiteAlpha.400' : 'gray.300',
            transform: 'translateY(-1px)',
          },
          _focus: {
            borderColor: 'brand.500',
            boxShadow: `0 0 0 1px ${props.colorMode === 'dark' ? 'brand.500' : 'brand.500'}, 0 0 8px ${props.colorMode === 'dark' ? 'brand.500' : 'brand.300'}`,
            transform: 'translateY(-1px)',
          },
        },
      }),
    },
    Card: {
      baseStyle: (props: any) => ({
        container: {
          bg: props.colorMode === 'dark' ? 'gray.800' : 'white',
          borderColor: props.colorMode === 'dark' ? 'whiteAlpha.200' : 'gray.200',
        },
      }),
    },
    Table: {
      baseStyle: (props: any) => ({
        th: {
          bg: props.colorMode === 'dark' ? 'whiteAlpha.100' : 'gray.50',
          color: props.colorMode === 'dark' ? 'whiteAlpha.900' : 'gray.700',
        },
        td: {
          borderColor: props.colorMode === 'dark' ? 'whiteAlpha.200' : 'gray.200',
        },
      }),
    },
    Tooltip: {
      baseStyle: (props: any) => ({
        bg: props.colorMode === 'dark' ? 'gray.700' : 'gray.800',
        color: 'white',
        borderRadius: 'md',
        px: 3,
        py: 2,
        fontSize: 'sm',
        fontWeight: 'medium',
        boxShadow: 'lg',
        maxW: '320px',
        zIndex: 1500,
      }),
      defaultProps: {
        openDelay: 300,
        closeDelay: 200,
        placement: 'top',
      },
    },
  },
});

function App() {
  return (
    <>
      <ColorModeScript initialColorMode={theme.config.initialColorMode} />
      <ChakraProvider theme={theme}>
        <ThemeProvider>
          <Router>
            <div style={{ position: 'relative', minHeight: '100vh' }}>
              <div style={{ position: 'fixed', top: '1rem', right: '1rem', zIndex: 50 }}>
                <ThemeToggle />
              </div>
              <Routes>
                <Route path="/" element={<LandingPage />} />
                <Route path="/calculate" element={<CalorieCalculator />} />
                <Route path="/about" element={<About />} />
              </Routes>
            </div>
          </Router>
        </ThemeProvider>
      </ChakraProvider>
    </>
  );
}

export default App; 