import React, { useState } from 'react';
import {
  Box,
  Button,
  Container,
  FormControl,
  FormLabel,
  Input,
  Select,
  VStack,
  Heading,
  Text,
  useToast,
  Grid,
  GridItem,
  NumberInput,
  NumberInputField,
  NumberInputStepper,
  NumberIncrementStepper,
  NumberDecrementStepper,
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
  Divider,
  Badge,
} from '@chakra-ui/react';
import { useNavigate } from 'react-router-dom';

interface FormData {
  // User Biometrics
  weight: string;
  heightFeet: number;
  heightInches: number;
  age: number;
  gender: string;
  activityLevel: string;
  
  // Trip Details
  tripDuration: number;
  trailDistance: string;
  totalElevation: number;
  season: string;
  
  // Optional Fields
  day?: number;
  trailDistanceByDay?: string;
  totalElevationByDay?: number;
  averageTemperature?: number;
  minTemperature?: number;
  maxTemperature?: number;
  peakAltitude?: number;
  precipitationChance?: number;
  baseWeight?: string;
  waterWeight?: string;
  hikerExperience?: string;
}

interface MacroData {
  carbs: number;
  fat: number;
  protein: number;
}

interface DayBreakdown {
  day: number;
  calories: number;
  macros: MacroData;
  hiking_hours: number;
}

interface CalorieResponse {
  daily_breakdown: DayBreakdown[];
  total_calories: number;
  total_macros: MacroData;
}

const CalorieCalculator: React.FC = () => {
  const navigate = useNavigate();
  const toast = useToast();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [calculationResult, setCalculationResult] = useState<CalorieResponse | null>(null);

  // Define default values for the form
  const defaultFormData: FormData = {
    weight: "160.0",
    heightFeet: 5,
    heightInches: 10,
    age: 33,
    gender: 'male',
    activityLevel: 'moderately_active',
    tripDuration: 3,
    trailDistance: "34.0",
    totalElevation: 5000,
    season: 'summer',
    baseWeight: "0.0",
    waterWeight: "0.0",
  };

  const [formData, setFormData] = useState<FormData>({
    ...defaultFormData
  });

  // Function to check if form is unchanged
  const isFormUnchanged = () => {
    return Object.keys(defaultFormData).every(
      key => formData[key as keyof FormData] === defaultFormData[key as keyof FormData]
    );
  };

  const handleInputChange = (field: keyof FormData, value: string | number) => {
    if (field === 'trailDistance' || field === 'trailDistanceByDay' || field === 'weight' || field === 'baseWeight' || field === 'waterWeight') {
      setFormData(prev => ({
        ...prev,
        [field]: value as string
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [field]: value
      }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const queryParams = new URLSearchParams();
      queryParams.append('weight', parseFloat(formData.weight).toString());
      const height = (formData.heightFeet || 0) * 12 + (formData.heightInches || 0);
      queryParams.append('height', height.toString());
      queryParams.append('age', formData.age.toString());
      queryParams.append('gender', formData.gender);
      queryParams.append('activityLevel', formData.activityLevel);
      queryParams.append('tripDuration', formData.tripDuration.toString());
      queryParams.append('trailDistance', parseFloat(formData.trailDistance).toString());
      queryParams.append('totalElevation', formData.totalElevation.toString());
      queryParams.append('season', formData.season);

      // Optional fields - only append if they have values
      if (formData.day) queryParams.append('day', formData.day.toString());
      if (formData.trailDistanceByDay) queryParams.append('trailDistanceByDay', parseFloat(formData.trailDistanceByDay).toString());
      if (formData.totalElevationByDay) queryParams.append('totalElevationByDay', formData.totalElevationByDay.toString());
      if (formData.averageTemperature) queryParams.append('averageTemperature', formData.averageTemperature.toString());
      if (formData.minTemperature) queryParams.append('minTemperature', formData.minTemperature.toString());
      if (formData.maxTemperature) queryParams.append('maxTemperature', formData.maxTemperature.toString());
      if (formData.peakAltitude) queryParams.append('peakAltitude', formData.peakAltitude.toString());
      if (formData.precipitationChance) queryParams.append('precipitationChance', formData.precipitationChance.toString());
      if (formData.baseWeight) queryParams.append('baseWeight', parseFloat(formData.baseWeight).toString());
      if (formData.waterWeight) queryParams.append('waterWeight', parseFloat(formData.waterWeight).toString());
      if (formData.hikerExperience) queryParams.append('hikerExperience', formData.hikerExperience);

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
      onOpen(); // Open the modal with results
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

  const formatNumber = (num: number): string => {
    return num.toLocaleString('en-US');
  };

  return (
    <Container maxW="container.xl" py={10}>
      <VStack spacing={8} align="stretch">
        <Heading textAlign="center">Calculate Your Hiking Calories</Heading>
        <Text textAlign="center" color="gray.600">
          Fill in your details to get personalized calorie recommendations for your hiking trip
        </Text>

        <form onSubmit={handleSubmit}>
          <Grid templateColumns="repeat(2, 1fr)" gap={6}>
            {/* User Biometrics */}
            <GridItem colSpan={2}>
              <Heading size="md" mb={4}>User Biometrics</Heading>
            </GridItem>
            
            <GridItem>
              <FormControl isRequired>
                <FormLabel>Weight (lbs)</FormLabel>
                <NumberInput
                  value={formData.weight}
                  onChange={(valueString) => handleInputChange('weight', valueString)}
                  step={0.1}
                  precision={1}
                >
                  <NumberInputField />
                  <NumberInputStepper>
                    <NumberIncrementStepper />
                    <NumberDecrementStepper />
                  </NumberInputStepper>
                </NumberInput>
              </FormControl>
            </GridItem>

            <GridItem>
              <FormControl isRequired>
                <FormLabel>Height</FormLabel>
                <Box display="flex" gap={2}>
                  <NumberInput
                    value={formData.heightFeet}
                    min={0}
                    max={8}
                    onChange={(_, value) => handleInputChange('heightFeet', value)}
                  >
                    <NumberInputField placeholder="5" />
                    <NumberInputStepper>
                      <NumberIncrementStepper />
                      <NumberDecrementStepper />
                    </NumberInputStepper>
                  </NumberInput>
                  <Text alignSelf="center">ft</Text>
                  <NumberInput
                    value={formData.heightInches}
                    min={0}
                    max={11}
                    onChange={(_, value) => handleInputChange('heightInches', value)}
                  >
                    <NumberInputField placeholder="10" />
                    <NumberInputStepper>
                      <NumberIncrementStepper />
                      <NumberDecrementStepper />
                    </NumberInputStepper>
                  </NumberInput>
                  <Text alignSelf="center">in</Text>
                </Box>
              </FormControl>
            </GridItem>

            <GridItem>
              <FormControl isRequired>
                <FormLabel>Age (years)</FormLabel>
                <NumberInput
                  value={formData.age}
                  onChange={(_, value) => handleInputChange('age', value)}
                >
                  <NumberInputField />
                  <NumberInputStepper>
                    <NumberIncrementStepper />
                    <NumberDecrementStepper />
                  </NumberInputStepper>
                </NumberInput>
              </FormControl>
            </GridItem>

            <GridItem>
              <FormControl isRequired>
                <FormLabel>Gender</FormLabel>
                <Select
                  value={formData.gender}
                  onChange={(e) => handleInputChange('gender', e.target.value)}
                  placeholder="Male"
                >
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
                <Select
                  value={formData.activityLevel}
                  onChange={(e) => handleInputChange('activityLevel', e.target.value)}
                  placeholder="Moderately Active"
                >
                  <option value="">Select activity level</option>
                  <option value="sedentary">Sedentary</option>
                  <option value="lightly_active">Lightly Active</option>
                  <option value="moderately_active">Moderately Active</option>
                  <option value="very_active">Very Active</option>
                  <option value="extra_active">Extra Active</option>
                </Select>
              </FormControl>
            </GridItem>

            {/* Trip Details */}
            <GridItem colSpan={2}>
              <Heading size="md" mt={8} mb={4}>Trip Details</Heading>
            </GridItem>

            <GridItem>
              <FormControl isRequired>
                <FormLabel>Trip Duration (days)</FormLabel>
                <NumberInput
                  value={formData.tripDuration}
                  onChange={(_, value) => handleInputChange('tripDuration', value)}
                >
                  <NumberInputField />
                  <NumberInputStepper>
                    <NumberIncrementStepper />
                    <NumberDecrementStepper />
                  </NumberInputStepper>
                </NumberInput>
              </FormControl>
            </GridItem>

            <GridItem>
              <FormControl isRequired>
                <FormLabel>Trail Distance (miles)</FormLabel>
                <NumberInput
                  value={formData.trailDistance}
                  onChange={(valueString) => handleInputChange('trailDistance', valueString)}
                  step={0.1}
                  precision={1}
                >
                  <NumberInputField />
                  <NumberInputStepper>
                    <NumberIncrementStepper />
                    <NumberDecrementStepper />
                  </NumberInputStepper>
                </NumberInput>
              </FormControl>
            </GridItem>

            <GridItem>
              <FormControl isRequired>
                <FormLabel>Total Elevation (feet)</FormLabel>
                <NumberInput
                  value={formData.totalElevation}
                  onChange={(_, value) => handleInputChange('totalElevation', value)}
                >
                  <NumberInputField />
                  <NumberInputStepper>
                    <NumberIncrementStepper />
                    <NumberDecrementStepper />
                  </NumberInputStepper>
                </NumberInput>
              </FormControl>
            </GridItem>

            <GridItem>
              <FormControl isRequired>
                <FormLabel>Season</FormLabel>
                <Select
                  value={formData.season}
                  onChange={(e) => handleInputChange('season', e.target.value)}
                  placeholder="Summer"
                >
                  <option value="">Select season</option>
                  <option value="spring">Spring</option>
                  <option value="summer">Summer</option>
                  <option value="fall">Fall</option>
                  <option value="winter">Winter</option>
                </Select>
              </FormControl>
            </GridItem>

            {/* Optional Fields */}
            <GridItem colSpan={2}>
              <Heading size="md" mt={8} mb={4}>Additional Details (Optional)</Heading>
            </GridItem>

            <GridItem>
              <FormControl>
                <FormLabel>Day Number</FormLabel>
                <NumberInput
                  value={formData.day}
                  onChange={(_, value) => handleInputChange('day', value)}
                >
                  <NumberInputField />
                  <NumberInputStepper>
                    <NumberIncrementStepper />
                    <NumberDecrementStepper />
                  </NumberInputStepper>
                </NumberInput>
              </FormControl>
            </GridItem>

            <GridItem>
              <FormControl>
                <FormLabel>Daily Trail Distance (miles)</FormLabel>
                <NumberInput
                  value={formData.trailDistanceByDay}
                  onChange={(valueString) => handleInputChange('trailDistanceByDay', valueString)}
                  step={0.1}
                  precision={1}
                >
                  <NumberInputField />
                  <NumberInputStepper>
                    <NumberIncrementStepper />
                    <NumberDecrementStepper />
                  </NumberInputStepper>
                </NumberInput>
              </FormControl>
            </GridItem>

            <GridItem>
              <FormControl>
                <FormLabel>Daily Elevation Gain (feet)</FormLabel>
                <NumberInput
                  value={formData.totalElevationByDay}
                  onChange={(_, value) => handleInputChange('totalElevationByDay', value)}
                >
                  <NumberInputField />
                  <NumberInputStepper>
                    <NumberIncrementStepper />
                    <NumberDecrementStepper />
                  </NumberInputStepper>
                </NumberInput>
              </FormControl>
            </GridItem>

            <GridItem>
              <FormControl>
                <FormLabel>Average Temperature (°F)</FormLabel>
                <NumberInput
                  value={formData.averageTemperature}
                  onChange={(_, value) => handleInputChange('averageTemperature', value)}
                >
                  <NumberInputField />
                  <NumberInputStepper>
                    <NumberIncrementStepper />
                    <NumberDecrementStepper />
                  </NumberInputStepper>
                </NumberInput>
              </FormControl>
            </GridItem>

            <GridItem>
              <FormControl>
                <FormLabel>Peak Altitude (feet)</FormLabel>
                <NumberInput
                  value={formData.peakAltitude}
                  onChange={(_, value) => handleInputChange('peakAltitude', value)}
                >
                  <NumberInputField />
                  <NumberInputStepper>
                    <NumberIncrementStepper />
                    <NumberDecrementStepper />
                  </NumberInputStepper>
                </NumberInput>
              </FormControl>
            </GridItem>

            <GridItem>
              <FormControl>
                <FormLabel>Precipitation Chance (%)</FormLabel>
                <NumberInput
                  value={formData.precipitationChance}
                  onChange={(_, value) => handleInputChange('precipitationChance', value)}
                >
                  <NumberInputField />
                  <NumberInputStepper>
                    <NumberIncrementStepper />
                    <NumberDecrementStepper />
                  </NumberInputStepper>
                </NumberInput>
              </FormControl>
            </GridItem>

            <GridItem>
              <FormControl>
                <FormLabel>Base Weight (lbs)</FormLabel>
                <NumberInput
                  value={formData.baseWeight}
                  onChange={(valueString) => handleInputChange('baseWeight', valueString)}
                  step={0.1}
                  precision={1}
                >
                  <NumberInputField />
                  <NumberInputStepper>
                    <NumberIncrementStepper />
                    <NumberDecrementStepper />
                  </NumberInputStepper>
                </NumberInput>
              </FormControl>
            </GridItem>

            <GridItem>
              <FormControl>
                <FormLabel>Water Weight (lbs)</FormLabel>
                <NumberInput
                  value={formData.waterWeight}
                  onChange={(valueString) => handleInputChange('waterWeight', valueString)}
                  step={0.1}
                  precision={1}
                >
                  <NumberInputField />
                  <NumberInputStepper>
                    <NumberIncrementStepper />
                    <NumberDecrementStepper />
                  </NumberInputStepper>
                </NumberInput>
              </FormControl>
            </GridItem>

            <GridItem>
              <FormControl>
                <FormLabel>Hiker Experience</FormLabel>
                <Select
                  value={formData.hikerExperience}
                  onChange={(e) => handleInputChange('hikerExperience', e.target.value)}
                >
                  <option value="">Select experience level</option>
                  <option value="beginner">Beginner</option>
                  <option value="intermediate">Intermediate</option>
                  <option value="advanced">Advanced</option>
                  <option value="expert">Expert</option>
                </Select>
              </FormControl>
            </GridItem>
          </Grid>

          <Box mt={8} display="flex" justifyContent="center" gap={4}>
            <Button
              colorScheme="gray"
              onClick={() => navigate('/')}
            >
              Back to Home
            </Button>
            <Button
              type="submit"
              colorScheme="brand"
              size="lg"
              px={8}
              disabled={isFormUnchanged()}
            >
              Calculate Calories
            </Button>
          </Box>
        </form>
      </VStack>

      {/* Results Modal */}
      <Modal isOpen={isOpen} onClose={onClose} size="xl">
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Calorie Calculation Results</ModalHeader>
          <ModalCloseButton />
          <ModalBody pb={6}>
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

                {/* Trip Details Summary */}
                <Box>
                  <Heading size="md" mb={4}>Trip Details</Heading>
                  <Grid templateColumns="repeat(2, 1fr)" gap={4}>
                    <Box>
                      <Text><strong>Distance:</strong> {parseFloat(formData.trailDistance).toFixed(1)} miles</Text>
                      <Text><strong>Elevation Gain:</strong> {formData.totalElevation} ft</Text>
                      <Text><strong>Season:</strong> {formData.season}</Text>
                    </Box>
                    <Box>
                      <Text><strong>Pack Weight:</strong> {formData.baseWeight ? parseFloat(formData.baseWeight).toFixed(1) : '0.0'} lbs</Text>
                      <Text><strong>Water Weight:</strong> {formData.waterWeight ? parseFloat(formData.waterWeight).toFixed(1) : '0.0'} lbs</Text>
                      <Text><strong>Experience:</strong> {formData.hikerExperience || 'Not specified'}</Text>
                    </Box>
                  </Grid>
                </Box>
              </VStack>
            )}
          </ModalBody>
        </ModalContent>
      </Modal>
    </Container>
  );
};

export default CalorieCalculator; 