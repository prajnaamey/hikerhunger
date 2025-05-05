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
} from '@chakra-ui/react';
import { useNavigate } from 'react-router-dom';

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
  const bgColor = useColorModeValue('white', 'gray.800');
  const cardBg = useColorModeValue('gray.50', 'gray.700');
  const navigate = useNavigate();

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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // TODO: Implement calculation or navigation
  };

  return (
    <Box bg={cardBg} borderRadius="lg" boxShadow="lg" p={8} maxW="2xl" mx="auto">
      <VStack spacing={4} align="center" textAlign="center" mb={6}>
        <Heading as="h2" size="xl" fontWeight="bold">
          Try Our Quick Calculator
        </Heading>
        <Text fontSize="lg" color="gray.600">
          Get a preview of what HikerHunger can do for your next adventure.
        </Text>
      </VStack>
      <form onSubmit={handleSubmit}>
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
  );
};

export default QuickCalorieCalculator; 