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
  return (
    <Box>
      {/* Hero Section */}
      <Box
        position="relative"
        minH={{ base: '60vh', md: '70vh' }}
        display="flex"
        alignItems="center"
        justifyContent="center"
        bgImage={`linear-gradient(rgba(34,49,63,0.7),rgba(34,49,63,0.5)), url('${HERO_BG_HIKER}')`}
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
              colorScheme="green"
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
              variant="outline"
              colorScheme="green"
              px={8}
              py={6}
              fontSize="lg"
              onClick={() => navigate('/about')}
            >
              About
            </Button>
          </HStack>
        </VStack>
      </Box>

      {/* Quick Calculator Section */}
      <Box bg="green.50" py={16} px={4}>
        <Container maxW="2xl">
          <QuickCalorieCalculator />
        </Container>
      </Box>
    </Box>
  );
};

export default LandingPage; 