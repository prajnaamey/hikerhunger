import React, { useState, useEffect } from 'react';
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
  Collapse,
  Switch,
  IconButton,
  HStack,
  Accordion,
  AccordionItem,
  AccordionButton,
  AccordionPanel,
  AccordionIcon,
  Stepper,
  Step,
  StepIndicator,
  StepStatus,
  StepTitle,
  StepDescription,
  StepSeparator,
  StepIcon,
  StepNumber,
  useSteps,
  Tooltip,
  InputGroup,
  InputLeftElement,
} from '@chakra-ui/react';
import { useNavigate } from 'react-router-dom';
import {
  AddIcon,
  DeleteIcon,
  InfoIcon,
  EditIcon,
  CalendarIcon,
  SunIcon,
  StarIcon,
  TimeIcon,
  TriangleUpIcon,
  ArrowUpIcon,
  RepeatIcon,
  ViewIcon,
  AtSignIcon,
  ArrowBackIcon,
} from '@chakra-ui/icons';
import {
  activityLevelTooltip,
  weightTooltip,
  heightTooltip,
  genderTooltip,
  trailDistanceTooltip,
  totalElevationTooltip,
  seasonTooltip,
  averageTemperatureTooltip,
  precipitationChanceTooltip,
  peakAltitudeTooltip,
  baseWeightTooltip,
  waterWeightTooltip,
  hikerExperienceTooltip
} from '../shared/tooltipContent';
import { LabeledFormField } from '../shared/LabeledFormField';

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

const steps = [
  { title: 'Trip Info', description: 'Required fields' },
  { title: 'Optional Details', description: 'Add more details (optional)' },
];

const CalorieCalculator: React.FC = () => {
  const navigate = useNavigate();
  const toast = useToast();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [calculationResult, setCalculationResult] = useState<CalorieResponse | null>(null);
  const [breakdownByDay, setBreakdownByDay] = useState(false);
  const [dailyBreakdown, setDailyBreakdown] = useState<{distance: string; elevation: number;}[]>([{distance: '', elevation: 0}]);
  const { activeStep, setActiveStep, goToNext, goToPrevious } = useSteps({ index: 0 });

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

  // Helper to sum daily values
  const sumDaily = (arr: {distance: string; elevation: number;}[]) => ({
    distance: arr.reduce((acc, d) => acc + (parseFloat(d.distance) || 0), 0),
    elevation: arr.reduce((acc, d) => acc + (d.elevation || 0), 0),
  });

  // Handler for daily breakdown changes
  const handleDailyChange = (idx: number, field: 'distance' | 'elevation', value: string | number) => {
    setDailyBreakdown(prev => prev.map((d, i) => i === idx ? {...d, [field]: value} : d));
  };

  // Add/remove day handlers
  const addDay = () => {
    if (dailyBreakdown.length < formData.tripDuration) {
      setDailyBreakdown(prev => [...prev, {distance: '', elevation: 0}]);
    }
  };
  const removeDay = (idx: number) => {
    setDailyBreakdown(prev => prev.filter((_, i) => i !== idx));
  };

  // Sync with formData/tripDuration
  useEffect(() => {
    if (dailyBreakdown.length > formData.tripDuration) {
      setDailyBreakdown(dailyBreakdown.slice(0, formData.tripDuration));
    }
    if (dailyBreakdown.length < 1) {
      setDailyBreakdown([{distance: '', elevation: 0}]);
    }
  }, [formData.tripDuration]);

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
      if (breakdownByDay) {
        queryParams.append('trailDistanceByDay', dailyBreakdown.map(d => parseFloat(d.distance) || 0).join(','));
        queryParams.append('totalElevationByDay', dailyBreakdown.map(d => d.elevation || 0).join(','));
      }
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

  // Step 1: Required fields
  const RequiredFieldsStep = (
    <form onSubmit={e => { e.preventDefault(); goToNext(); }}>
      <Grid templateColumns="repeat(2, 1fr)" gap={6}>
        {/* User Biometrics */}
        <GridItem colSpan={2}>
          <Heading size="md" mb={4}>User Biometrics</Heading>
        </GridItem>
        
        <GridItem>
          <LabeledFormField
            label="Weight (lbs)"
            tooltip={weightTooltip}
            isRequired
            labelIcon={<EditIcon />}
          >
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
          </LabeledFormField>
        </GridItem>

        <GridItem>
          <LabeledFormField
            label="Height"
            tooltip={heightTooltip}
            isRequired
            labelIcon={<EditIcon />}
          >
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
          </LabeledFormField>
        </GridItem>

        <GridItem>
          <LabeledFormField
            label="Age (years)"
            isRequired
            labelIcon={<EditIcon />}
          >
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
          </LabeledFormField>
        </GridItem>

        <GridItem>
          <LabeledFormField
            label="Gender"
            tooltip={genderTooltip}
            isRequired
            labelIcon={<AtSignIcon />}
          >
            <Select
              value={formData.gender}
              onChange={(e) => handleInputChange('gender', e.target.value)}
              placeholder="Select gender"
              variant="filled"
            >
              <option value="male">Male</option>
              <option value="female">Female</option>
              <option value="other">Other</option>
            </Select>
          </LabeledFormField>
        </GridItem>

        <GridItem>
          <LabeledFormField
            label="Activity Level"
            tooltip={activityLevelTooltip}
            isRequired
            labelIcon={<RepeatIcon />}
          >
            <Select
              value={formData.activityLevel}
              onChange={(e) => handleInputChange('activityLevel', e.target.value)}
              placeholder="Select activity level"
              variant="filled"
            >
              <option value="sedentary">Sedentary</option>
              <option value="lightly_active">Lightly Active</option>
              <option value="moderately_active">Moderately Active</option>
              <option value="very_active">Very Active</option>
              <option value="extra_active">Extra Active</option>
            </Select>
          </LabeledFormField>
        </GridItem>

        {/* Trip Details */}
        <GridItem colSpan={2}>
          <Heading size="md" mt={8} mb={4}>Trip Details</Heading>
        </GridItem>

        <GridItem>
          <FormControl isRequired>
            <FormLabel>
              <HStack spacing={2}>
                <EditIcon />
                <Text>Trip Duration (days)</Text>
              </HStack>
            </FormLabel>
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
          <LabeledFormField
            label="Trail Distance (miles)"
            tooltip={trailDistanceTooltip}
            isRequired
            labelIcon={<TimeIcon />}
          >
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
          </LabeledFormField>
        </GridItem>

        <GridItem>
          <LabeledFormField
            label="Total Elevation (feet)"
            tooltip={totalElevationTooltip}
            isRequired
            labelIcon={<TriangleUpIcon />}
          >
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
          </LabeledFormField>
        </GridItem>

        <GridItem>
          <LabeledFormField
            label="Season"
            tooltip={seasonTooltip}
            isRequired
            labelIcon={<SunIcon />}
          >
            <Select
              value={formData.season}
              onChange={(e) => handleInputChange('season', e.target.value)}
              placeholder="Select season"
              variant="filled"
            >
              <option value="spring">Spring</option>
              <option value="summer">Summer</option>
              <option value="fall">Fall</option>
              <option value="winter">Winter</option>
            </Select>
          </LabeledFormField>
        </GridItem>
      </Grid>
      <Box mt={8} display="flex" justifyContent="flex-end" gap={4}>
        <Button type="submit" colorScheme="brand" size="lg" px={8}>
          Next
        </Button>
      </Box>
    </form>
  );

  // Step 2: Optional fields (accordion as before)
  const OptionalFieldsStep = (
    <form onSubmit={handleSubmit}>
      <Text mb={4} color="gray.500">All fields below are optional. You can submit without filling them in.</Text>
      <Box mb={8}>
        <Heading size="sm" mb={4}>Environmental & Pack Details</Heading>
        <VStack spacing={4} align="stretch">
          <LabeledFormField
            label="Average Temperature (°F)"
            tooltip={averageTemperatureTooltip}
            labelIcon={<ViewIcon />}
          >
            <NumberInput
              value={formData.averageTemperature}
              onChange={(_: string, value: number) => handleInputChange('averageTemperature', value)}
            >
              <NumberInputField />
              <NumberInputStepper>
                <NumberIncrementStepper />
                <NumberDecrementStepper />
              </NumberInputStepper>
            </NumberInput>
          </LabeledFormField>

          <LabeledFormField
            label="Precipitation Chance (%)"
            tooltip={precipitationChanceTooltip}
            labelIcon={<ArrowUpIcon />}
          >
            <NumberInput
              value={formData.precipitationChance}
              onChange={(_: string, value: number) => handleInputChange('precipitationChance', value)}
            >
              <NumberInputField />
              <NumberInputStepper>
                <NumberIncrementStepper />
                <NumberDecrementStepper />
              </NumberInputStepper>
            </NumberInput>
          </LabeledFormField>

          <LabeledFormField
            label="Peak Altitude (feet)"
            tooltip={peakAltitudeTooltip}
            labelIcon={<ArrowUpIcon />}
          >
            <NumberInput
              value={formData.peakAltitude}
              onChange={(_: string, value: number) => handleInputChange('peakAltitude', value)}
            >
              <NumberInputField />
              <NumberInputStepper>
                <NumberIncrementStepper />
                <NumberDecrementStepper />
              </NumberInputStepper>
            </NumberInput>
          </LabeledFormField>

          <LabeledFormField
            label="Base Weight (lbs)"
            tooltip={baseWeightTooltip}
            labelIcon={<ViewIcon />}
          >
            <NumberInput
              value={formData.baseWeight}
              onChange={(valueString: string) => handleInputChange('baseWeight', valueString)}
              step={0.1}
              precision={1}
            >
              <NumberInputField />
              <NumberInputStepper>
                <NumberIncrementStepper />
                <NumberDecrementStepper />
              </NumberInputStepper>
            </NumberInput>
          </LabeledFormField>

          <LabeledFormField
            label="Water Weight (lbs)"
            tooltip={waterWeightTooltip}
            labelIcon={<ArrowUpIcon />}
          >
            <NumberInput
              value={formData.waterWeight}
              onChange={(valueString: string) => handleInputChange('waterWeight', valueString)}
              step={0.1}
              precision={1}
            >
              <NumberInputField />
              <NumberInputStepper>
                <NumberIncrementStepper />
                <NumberDecrementStepper />
              </NumberInputStepper>
            </NumberInput>
          </LabeledFormField>

          <LabeledFormField
            label="Hiker Experience"
            tooltip={hikerExperienceTooltip}
            labelIcon={<StarIcon />}
          >
            <Select
              value={formData.hikerExperience}
              onChange={(e: React.ChangeEvent<HTMLSelectElement>) => handleInputChange('hikerExperience', e.target.value)}
              variant="filled"
            >
              <option value="">Select experience level</option>
              <option value="beginner">Beginner</option>
              <option value="intermediate">Intermediate</option>
              <option value="advanced">Advanced</option>
              <option value="expert">Expert</option>
            </Select>
          </LabeledFormField>
        </VStack>
      </Box>
      <Box mb={8}>
        <Heading size="sm" mb={4}>Daily Breakdown (Optional)</Heading>
        <Collapse in={true} animateOpacity>
          <Box p={4} borderWidth={1} borderRadius="lg" bg="gray.50">
            <HStack mb={4}>
              <Switch isChecked={breakdownByDay} onChange={() => setBreakdownByDay(v => !v)} id="breakdown-by-day-switch" />
              <FormLabel htmlFor="breakdown-by-day-switch" mb={0} fontWeight="bold">Breakdown by Day</FormLabel>
            </HStack>
            {breakdownByDay && (
              <Box>
                <Heading size="sm" mb={2}>Daily Breakdown</Heading>
                {dailyBreakdown.map((day, idx) => (
                  <HStack key={idx} mb={2} align="flex-end">
                    <Box minW="60px">Day {idx + 1}</Box>
                    <FormControl isRequired>
                      <FormLabel mb={0}>Distance (miles)</FormLabel>
                      <NumberInput
                        value={day.distance}
                        min={0}
                        step={0.1}
                        precision={1}
                        onChange={(v: string) => handleDailyChange(idx, 'distance', v)}
                      >
                        <NumberInputField />
                      </NumberInput>
                    </FormControl>
                    <FormControl isRequired>
                      <FormLabel mb={0}>Elevation (ft)</FormLabel>
                      <NumberInput
                        value={day.elevation}
                        min={0}
                        onChange={(_: string, v: number) => handleDailyChange(idx, 'elevation', v)}
                      >
                        <NumberInputField />
                      </NumberInput>
                    </FormControl>
                    {dailyBreakdown.length > 1 && (
                      <IconButton aria-label="Remove day" icon={<DeleteIcon />} size="sm" onClick={() => removeDay(idx)} />
                    )}
                  </HStack>
                ))}
                <Button
                  leftIcon={<AddIcon />} size="sm" mt={2}
                  onClick={addDay}
                  isDisabled={dailyBreakdown.length >= formData.tripDuration}
                >Add Day</Button>
                <Box mt={2} fontSize="sm">
                  <Text>Total Distance: <b>{sumDaily(dailyBreakdown).distance}</b> / {formData.trailDistance} miles</Text>
                  <Text>Total Elevation: <b>{sumDaily(dailyBreakdown).elevation}</b> / {formData.totalElevation} ft</Text>
                  {(sumDaily(dailyBreakdown).distance !== parseFloat(formData.trailDistance) || sumDaily(dailyBreakdown).elevation !== formData.totalElevation) && (
                    <Text color="red.500">Sums must match trip totals!</Text>
                  )}
                </Box>
              </Box>
            )}
          </Box>
        </Collapse>
      </Box>
      <Box mt={8} display="flex" justifyContent="space-between" gap={4}>
        <Button onClick={goToPrevious}>Back</Button>
        <Button type="submit" colorScheme="brand" size="lg" px={8}>
          Calculate Calories
        </Button>
      </Box>
    </form>
  );

  // Render stepper and current step
  return (
    <Container maxW="container.xl" py={10}>
      <Stepper index={activeStep} mb={8}>
        {steps.map((step, index) => (
          <Step key={index}>
            <StepIndicator>
              <StepStatus complete={<StepIcon />} incomplete={<StepNumber />} active={<StepNumber />} />
            </StepIndicator>
            <Box flexShrink="0">
              <StepTitle>{step.title}</StepTitle>
              <StepDescription>{step.description}</StepDescription>
            </Box>
            <StepSeparator />
          </Step>
        ))}
      </Stepper>
      {activeStep === 0 && RequiredFieldsStep}
      {activeStep === 1 && OptionalFieldsStep}

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