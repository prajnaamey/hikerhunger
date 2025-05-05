import React, { useState } from 'react';
import {
  Box,
  Button,
  Container,
  Heading,
  Text,
  VStack,
  HStack,
  Grid,
  GridItem,
  FormControl,
  FormLabel,
  NumberInput,
  NumberInputField,
  NumberInputStepper,
  NumberIncrementStepper,
  NumberDecrementStepper,
  Select,
  useColorModeValue,
  Tabs,
  TabList,
  Tab,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalCloseButton,
  useDisclosure,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  Stat,
  StatLabel,
  StatNumber,
  StatGroup,
  useToast,
  IconButton,
} from '@chakra-ui/react';
import { ArrowBackIcon } from '@chakra-ui/icons';
import { useNavigate } from 'react-router-dom';

interface CalorieResponse {
  daily_breakdown: {
    day: number;
    calories: number;
    macros: {
      carbs: number;
      fat: number;
      protein: number;
    };
    hiking_hours: number;
  }[];
  total_calories: number;
  total_macros: {
    carbs: number;
    fat: number;
    protein: number;
  };
}

const initialFormData = {
  weight: '',
  heightFeet: '',
  heightInches: '',
  age: '',
  gender: '',
  activityLevel: '',
  tripDuration: 1,
  trailDistance: '',
  totalElevation: '',
  season: '',
};

const QuickCalorieCalculator: React.FC = () => {
  const [formData, setFormData] = useState(initialFormData);
  const [tripType, setTripType] = useState<'day' | 'multi'>('day');
  const [calculationResult, setCalculationResult] = useState<CalorieResponse | null>(null);
  const [isFlipped, setIsFlipped] = useState(false);
  const bgColor = useColorModeValue('white', 'gray.800');
  const navigate = useNavigate();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const toast = useToast();

  const handleInputChange = (field: string, value: string | number) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleTripTypeChange = (type: 'day' | 'multi') => {
    setTripType(type);
    setFormData((prev) => ({
      ...prev,
      tripDuration: type === 'day' ? 1 : 2,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const queryParams = new URLSearchParams();
      queryParams.append('weight', parseFloat(formData.weight).toString());
      const height = (parseInt(formData.heightFeet) || 0) * 12 + (parseInt(formData.heightInches) || 0);
      queryParams.append('height', height.toString());
      queryParams.append('age', formData.age);
      queryParams.append('gender', formData.gender);
      queryParams.append('activityLevel', formData.activityLevel);
      queryParams.append('tripDuration', formData.tripDuration.toString());
      queryParams.append('trailDistance', parseFloat(formData.trailDistance).toString());
      queryParams.append('totalElevation', formData.totalElevation);
      queryParams.append('season', formData.season);

      const response = await fetch(`http://localhost:8000/v1/api/calculate-calories?${queryParams.toString()}`, {
        method: 'GET',
        headers: {
          'Accept': 'application/json',
        },
      });
      
      if (!response.ok) {
        throw new Error('Failed to calculate calories');
      }
      
      const data: CalorieResponse = await response.json();
      setCalculationResult(data);
      setIsFlipped(true);
    } catch (error) {
      console.error('Error:', error);
      toast({
        title: 'Error',
        description: 'Failed to calculate calories. Please try again.',
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
    }
  };

  const handleFlipBack = () => setIsFlipped(false);

  const formatNumber = (num: number): string => {
    return num.toLocaleString('en-US');
  };

  // Dynamically determine card height based on results
  const getCardHeight = () => {
    if (isFlipped && calculationResult) {
      const days = calculationResult.daily_breakdown.length;
      if (days > 10) return 1100;
      if (days > 5) return 900;
      if (days > 2) return 800;
      return 700;
    }
    return 700;
  };
  const cardHeight = getCardHeight();

  // Flip card styles
  const flipCardStyles = {
    perspective: '1200px',
    width: '100%',
    maxWidth: '600px',
    margin: '0 auto',
    position: 'relative' as const,
    minHeight: `${cardHeight}px`,
    height: `${cardHeight}px`,
    overflow: 'hidden' as const,
  };
  const flipInnerStyles = {
    position: 'relative' as const,
    width: '100%',
    height: '100%',
    transition: 'transform 0.6s cubic-bezier(.4,2,.6,1)',
    transformStyle: 'preserve-3d' as const,
    transform: isFlipped ? 'rotateY(180deg)' : 'none',
  };
  const flipFaceStyles = {
    position: 'absolute' as const,
    width: '100%',
    height: '100%',
    backfaceVisibility: 'hidden' as const,
    top: 0,
    left: 0,
    overflowY: 'auto' as const,
    display: 'flex',
    flexDirection: 'column',
  };
  const flipBackStyles = {
    ...flipFaceStyles,
    transform: 'rotateY(180deg)',
  };

  return (
    <Box sx={flipCardStyles}>
      <Box sx={flipInnerStyles}>
        {/* Front: Calculator Form */}
        <Box sx={flipFaceStyles} bg="white" borderRadius="lg" boxShadow="lg" p={8}>
          <VStack spacing={4} align="center" textAlign="center" mb={6}>
            <Heading as="h2" size="xl" fontWeight="bold">
              Try Our Quick Calculator
            </Heading>
            <Text fontSize="lg" color="gray.600">
              Get a preview of what HikerHunger can do for your next adventure.
            </Text>
          </VStack>
          <form onSubmit={handleSubmit} style={{ width: '100%' }}>
            <VStack spacing={6}>
              <Tabs variant="soft-rounded" colorScheme="green" alignSelf="flex-start" mb={2} index={tripType === 'day' ? 0 : 1} onChange={(idx) => handleTripTypeChange(idx === 0 ? 'day' : 'multi')}>
                <TabList>
                  <Tab>Day Hike</Tab>
                  <Tab>Multi-Day Trip</Tab>
                </TabList>
              </Tabs>
              <Grid templateColumns={{ base: '1fr', md: '1fr 1fr' }} gap={4} w="100%">
                <GridItem>
                  <FormControl isRequired>
                    <FormLabel>Weight (lbs)</FormLabel>
                    <NumberInput value={Number(formData.weight) || ''} onChange={(_, v) => handleInputChange('weight', v)} min={0}>
                      <NumberInputField />
                    </NumberInput>
                  </FormControl>
                </GridItem>
                <GridItem>
                  <FormControl isRequired>
                    <FormLabel>Height</FormLabel>
                    <HStack>
                      <NumberInput value={Number(formData.heightFeet) || ''} min={0} max={8} onChange={(_, v) => handleInputChange('heightFeet', v)}>
                        <NumberInputField placeholder="ft" />
                      </NumberInput>
                      <NumberInput value={Number(formData.heightInches) || ''} min={0} max={11} onChange={(_, v) => handleInputChange('heightInches', v)}>
                        <NumberInputField placeholder="in" />
                      </NumberInput>
                    </HStack>
                  </FormControl>
                </GridItem>
                <GridItem>
                  <FormControl isRequired>
                    <FormLabel>Age (years)</FormLabel>
                    <NumberInput value={Number(formData.age) || ''} min={0} onChange={(_, v) => handleInputChange('age', v)}>
                      <NumberInputField />
                    </NumberInput>
                  </FormControl>
                </GridItem>
                <GridItem>
                  <FormControl isRequired>
                    <FormLabel>Gender</FormLabel>
                    <Select value={formData.gender} onChange={(e) => handleInputChange('gender', e.target.value)}>
                      <option value="">Select gender</option>
                      <option value="male">Male</option>
                      <option value="female">Female</option>
                      <option value="other">Other</option>
                    </Select>
                  </FormControl>
                </GridItem>
                <GridItem>
                  <FormControl isRequired>
                    <FormLabel>Activity Level</FormLabel>
                    <Select value={formData.activityLevel} onChange={(e) => handleInputChange('activityLevel', e.target.value)}>
                      <option value="">Select activity level</option>
                      <option value="sedentary">Sedentary</option>
                      <option value="lightly_active">Lightly Active</option>
                      <option value="moderately_active">Moderately Active</option>
                      <option value="very_active">Very Active</option>
                      <option value="extra_active">Extra Active</option>
                    </Select>
                  </FormControl>
                </GridItem>
                {tripType === 'multi' && (
                  <GridItem>
                    <FormControl isRequired>
                      <FormLabel>Trip Duration (days)</FormLabel>
                      <NumberInput value={Number(formData.tripDuration) || 2} min={1} onChange={(_, v) => handleInputChange('tripDuration', v)}>
                        <NumberInputField />
                      </NumberInput>
                    </FormControl>
                  </GridItem>
                )}
                <GridItem>
                  <FormControl isRequired>
                    <FormLabel>Trail Distance (miles)</FormLabel>
                    <NumberInput value={Number(formData.trailDistance) || ''} min={0} onChange={(_, v) => handleInputChange('trailDistance', v)}>
                      <NumberInputField />
                    </NumberInput>
                  </FormControl>
                </GridItem>
                <GridItem>
                  <FormControl isRequired>
                    <FormLabel>Total Elevation (feet)</FormLabel>
                    <NumberInput value={Number(formData.totalElevation) || ''} min={0} onChange={(_, v) => handleInputChange('totalElevation', v)}>
                      <NumberInputField />
                    </NumberInput>
                  </FormControl>
                </GridItem>
                <GridItem>
                  <FormControl isRequired>
                    <FormLabel>Season</FormLabel>
                    <Select value={formData.season} onChange={(e) => handleInputChange('season', e.target.value)}>
                      <option value="">Select season</option>
                      <option value="spring">Spring</option>
                      <option value="summer">Summer</option>
                      <option value="fall">Fall</option>
                      <option value="winter">Winter</option>
                    </Select>
                  </FormControl>
                </GridItem>
              </Grid>
              <Button colorScheme="green" size="lg" type="submit" w="100%">
                Calculate
              </Button>
              <Button variant="outline" colorScheme="green" w="100%" onClick={() => navigate('/calculate')}>
                See Advanced Calculator
              </Button>
            </VStack>
          </form>
        </Box>
        {/* Back: Results */}
        <Box sx={flipBackStyles} bg="white" borderRadius="lg" boxShadow="lg" p={8}>
          <HStack justifyContent="space-between" mb={4}>
            <Heading as="h3" size="lg">Calorie Calculation Results</Heading>
            <IconButton aria-label="Back" icon={<ArrowBackIcon />} onClick={handleFlipBack} variant="ghost" />
          </HStack>
          {calculationResult && (
            <VStack spacing={6} align="stretch">
              {/* Total Summary */}
              <Box p={4} borderWidth={1} borderRadius="lg" bg="gray.50">
                <StatGroup>
                  <Stat>
                    <StatLabel>Total Calories</StatLabel>
                    <StatNumber>{formatNumber(calculationResult.total_calories)}</StatNumber>
                  </Stat>
                </StatGroup>
              </Box>
              {/* Total Macros */}
              <Box>
                <Heading size="md" mb={4}>Total Macronutrients</Heading>
                <Grid templateColumns="repeat(3, 1fr)" gap={4}>
                  <Box p={4} borderWidth={1} borderRadius="lg" bg="green.50">
                    <Stat>
                      <StatLabel>Carbs (g)</StatLabel>
                      <StatNumber>{formatNumber(calculationResult.total_macros.carbs)}</StatNumber>
                    </Stat>
                  </Box>
                  <Box p={4} borderWidth={1} borderRadius="lg" bg="yellow.50">
                    <Stat>
                      <StatLabel>Fat (g)</StatLabel>
                      <StatNumber>{formatNumber(calculationResult.total_macros.fat)}</StatNumber>
                    </Stat>
                  </Box>
                  <Box p={4} borderWidth={1} borderRadius="lg" bg="red.50">
                    <Stat>
                      <StatLabel>Protein (g)</StatLabel>
                      <StatNumber>{formatNumber(calculationResult.total_macros.protein)}</StatNumber>
                    </Stat>
                  </Box>
                </Grid>
              </Box>
              {/* Daily Breakdown */}
              <Box>
                <Heading size="md" mb={4}>Daily Breakdown</Heading>
                <Table variant="simple">
                  <Thead>
                    <Tr>
                      <Th>Day</Th>
                      <Th>Calories</Th>
                      <Th>Carbs (g)</Th>
                      <Th>Fat (g)</Th>
                      <Th>Protein (g)</Th>
                      <Th>Hiking Hours</Th>
                    </Tr>
                  </Thead>
                  <Tbody>
                    {calculationResult.daily_breakdown.map((day) => (
                      <Tr key={day.day}>
                        <Td>{day.day}</Td>
                        <Td>{formatNumber(day.calories)}</Td>
                        <Td>{formatNumber(day.macros.carbs)}</Td>
                        <Td>{formatNumber(day.macros.fat)}</Td>
                        <Td>{formatNumber(day.macros.protein)}</Td>
                        <Td>{day.hiking_hours}</Td>
                      </Tr>
                    ))}
                  </Tbody>
                </Table>
              </Box>
            </VStack>
          )}
        </Box>
      </Box>
    </Box>
  );
};

export default QuickCalorieCalculator; 