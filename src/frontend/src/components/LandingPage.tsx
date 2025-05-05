import React from 'react';
import {
  Box,
  Button,
  Container,
  Heading,
  Text,
  VStack,
  HStack,
  Image,
  useColorModeValue,
} from '@chakra-ui/react';
import { useNavigate } from 'react-router-dom';

export interface LandingPageProps {}

const LandingPage: React.FC<LandingPageProps> = () => {
  const navigate = useNavigate();
  const bgColor = useColorModeValue('gray.50', 'gray.900');
  const textColor = useColorModeValue('gray.800', 'white');

  return (
    <Box bg={bgColor} minH="100vh">
      <Container maxW="container.xl" py={20}>
        <VStack spacing={8} align="center" textAlign="center">
          <Heading
            as="h1"
            size="2xl"
            bgGradient="linear(to-r, brand.400, brand.600)"
            bgClip="text"
            fontWeight="extrabold"
          >
            HikerHunger
          </Heading>
          
          <Text fontSize="xl" color={textColor} maxW="2xl">
            Calculate your perfect meal plan for your next hiking adventure. 
            Get personalized calorie recommendations based on your trip details and personal metrics.
          </Text>

          <HStack spacing={4}>
            <Button
              size="lg"
              colorScheme="brand"
              px={8}
              py={6}
              fontSize="lg"
              fontWeight="bold"
              onClick={() => navigate('/calculate')}
            >
              Calculate Calories
            </Button>
            <Button
              size="lg"
              variant="outline"
              colorScheme="brand"
              px={8}
              py={6}
              fontSize="lg"
            >
              Learn More
            </Button>
          </HStack>

          <Box
            mt={8}
            borderRadius="lg"
            overflow="hidden"
            boxShadow="xl"
            maxW="3xl"
          >
            <Image
              src="https://images.unsplash.com/photo-1483728642387-6c3bdd6c93e5?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80"
              alt="Hiker in mountains"
              objectFit="cover"
            />
          </Box>

          <VStack spacing={6} mt={12} maxW="2xl">
            <Heading size="lg">Why HikerHunger?</Heading>
            <Text fontSize="lg" color={textColor}>
              Our advanced algorithm takes into account your body metrics, trail conditions, 
              and environmental factors to provide you with the most accurate calorie 
              recommendations for your hiking trip.
            </Text>
          </VStack>
        </VStack>
      </Container>
    </Box>
  );
};

export default LandingPage; 