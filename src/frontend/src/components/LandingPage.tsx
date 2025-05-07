import React from 'react';
import {
  Box,
  Button,
  Container,
  Heading,
  Text,
  VStack,
  HStack,
  useColorModeValue,
  SimpleGrid,
  Icon,
} from '@chakra-ui/react';
import { FaHiking, FaMapMarkedAlt, FaCheckCircle } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import QuickCalorieCalculator from './QuickCalorieCalculator';

export interface LandingPageProps {}

// Clean, meaningful image constants
const HERO_BG_HIKER = 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=1500&q=80';
const HOW_IT_WORKS_BG_PINE = 'https://images.unsplash.com/photo-1483728642387-6c3bdd6c93e5?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80';

const LandingPage: React.FC = () => {
  const navigate = useNavigate();
  const bgColor = useColorModeValue('green.50', 'gray.800');
  const textColor = useColorModeValue('gray.800', 'whiteAlpha.900');
  const overlayColor = useColorModeValue('rgba(34,49,63,0.7)', 'rgba(0,0,0,0.8)');

  return (
    <Box>
      {/* Hero Section */}
      <Box
        position="relative"
        minH={{ base: '60vh', md: '70vh' }}
        display="flex"
        alignItems="center"
        justifyContent="center"
        bgImage={`linear-gradient(${overlayColor},${overlayColor}), url('${HERO_BG_HIKER}')`}
        bgSize="cover"
        bgPosition="center"
        color="white"
        textAlign="center"
        px={4}
      >
        <VStack spacing={6} w="full" maxW="3xl" zIndex={2}>
          <Heading as="h1" size="2xl" fontWeight="extrabold" lineHeight="1.1">
            Fuel Your Adventure With Perfect Calorie Planning
          </Heading>
          <Text fontSize="xl" fontWeight="medium">
            Calculate your ideal hiking nutrition in seconds. Get personalized calorie recommendations based on your metrics, trip details, and trail conditions.
          </Text>
          <HStack spacing={4} justify="center">
            <Button
              size="lg"
              colorScheme="brand"
              px={8}
              py={6}
              fontSize="lg"
              fontWeight="bold"
              onClick={() => {
                window.scrollTo({ top: window.innerHeight, behavior: 'smooth' });
              }}
            >
              Try Quick Calculator
            </Button>
            <Button
              size="lg"
              colorScheme="teal"
              variant="solid"
              px={8}
              py={6}
              fontSize="lg"
              fontWeight="bold"
              onClick={() => navigate('/calculate')}
            >
              Try Advanced Calculator
            </Button>
          </HStack>
        </VStack>
      </Box>

      {/* Quick Calculator Section */}
      <Box bg={bgColor} py={16} px={4}>
        <Container maxW="2xl">
          <QuickCalorieCalculator />
          <VStack mt={8} spacing={4} align="center">
            <Text color={textColor} fontSize="md" textAlign="center">
              <strong>Quick Calculator:</strong> Great for getting started fast! Just enter a few details and get your calorie needs instantly.
            </Text>
            <Text color={textColor} fontSize="md" textAlign="center">
              <strong>Need more control?</strong> The <Button variant="link" colorScheme="teal" onClick={() => navigate('/calculate')}>Advanced Calculator</Button> lets you fine-tune every aspect of your trip for the most accurate results.
            </Text>
          </VStack>
        </Container>
      </Box>

      {/* Footer */}
      <Box as="footer" w="full" py={6} bg={useColorModeValue('gray.100', 'gray.900')} textAlign="center">
        <Button variant="link" colorScheme="teal" fontSize="md" onClick={() => navigate('/about')}>
          About
        </Button>
      </Box>
    </Box>
  );
};

export default LandingPage; 