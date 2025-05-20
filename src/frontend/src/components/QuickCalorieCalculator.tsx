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
  Tooltip,
} from '@chakra-ui/react';
import { ArrowBackIcon, AddIcon, DeleteIcon, InfoIcon, EditIcon, CalendarIcon, SunIcon, StarIcon, TimeIcon, TriangleUpIcon, ArrowUpIcon, RepeatIcon, ViewIcon, AtSignIcon } from '@chakra-ui/icons';
import { useNavigate } from 'react-router-dom';
import {
  activityLevelTooltip,
  weightTooltip,
  heightTooltip,
  genderTooltip,
  trailDistanceTooltip,
  totalElevationTooltip,
  seasonTooltip
} from '../shared/tooltipContent';
import { LabeledFormField } from '../shared/LabeledFormField';

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
  const navigate = useNavigate();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const toast = useToast();

  // Color mode values
  const cardBg = useColorModeValue('white', 'gray.800');
  const borderColor = useColorModeValue('gray.200', 'whiteAlpha.200');
  const textColor = useColorModeValue('gray.800', 'whiteAlpha.900');
  const labelColor = useColorModeValue('gray.600', 'whiteAlpha.700');
  const tableBg = useColorModeValue('gray.50', 'whiteAlpha.50');
  const tableBorderColor = useColorModeValue('gray.200', 'whiteAlpha.200');

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
        <Box 
          sx={flipFaceStyles} 
          bg={cardBg} 
          borderRadius="lg" 
          boxShadow="lg" 
          p={8}
          border="1px solid"
          borderColor={borderColor}
        >
          <VStack spacing={6} align="stretch">
            <Heading size="lg" color={textColor}>Quick Calorie Calculator</Heading>
            <Text color={labelColor}>Calculate your hiking calorie needs in seconds</Text>
            
            <form onSubmit={handleSubmit}>
              <VStack spacing={6}>
                <Tabs 
                  variant="soft-rounded" 
                  colorScheme="brand" 
                  alignSelf="flex-start" 
                  mb={2} 
                  index={tripType === 'day' ? 0 : 1} 
                  onChange={(idx) => handleTripTypeChange(idx === 0 ? 'day' : 'multi')}
                >
                  <TabList>
                    <Tab>Day Hike</Tab>
                    <Tab>Multi-Day Trip</Tab>
                  </TabList>
                </Tabs>

                <Grid templateColumns={{ base: '1fr', md: '1fr 1fr' }} gap={4} w="100%">
                  <GridItem>
                    <LabeledFormField
                      label="Weight (lbs)"
                      tooltip={weightTooltip}
                      labelIcon={<EditIcon />}
                    >
                      <NumberInput value={Number(formData.weight) || ''} onChange={(_, v) => handleInputChange('weight', v)} min={0}>
                        <NumberInputField />
                      </NumberInput>
                    </LabeledFormField>
                  </GridItem>

                  <GridItem>
                    <LabeledFormField
                      label="Height"
                      tooltip={heightTooltip}
                      labelIcon={<EditIcon />}
                    >
                      <HStack>
                        <NumberInput value={Number(formData.heightFeet) || ''} min={0} max={8} onChange={(_, v) => handleInputChange('heightFeet', v)}>
                          <NumberInputField placeholder="ft" />
                        </NumberInput>
                        <NumberInput value={Number(formData.heightInches) || ''} min={0} max={11} onChange={(_, v) => handleInputChange('heightInches', v)}>
                          <NumberInputField placeholder="in" />
                        </NumberInput>
                      </HStack>
                    </LabeledFormField>
                  </GridItem>

                  <GridItem>
                    <LabeledFormField
                      label="Age (years)"
                      labelIcon={<EditIcon />}
                    >
                      <NumberInput value={Number(formData.age) || ''} onChange={(_, v) => handleInputChange('age', v)} min={0}>
                        <NumberInputField />
                      </NumberInput>
                    </LabeledFormField>
                  </GridItem>

                  <GridItem>
                    <LabeledFormField
                      label="Gender"
                      tooltip={genderTooltip}
                      labelIcon={<AtSignIcon />}
                    >
                      <Select 
                        value={formData.gender} 
                        onChange={(e) => handleInputChange('gender', e.target.value)}
                      >
                        <option value="">Select gender</option>
                        <option value="male">Male</option>
                        <option value="female">Female</option>
                      </Select>
                    </LabeledFormField>
                  </GridItem>

                  <GridItem>
                    <LabeledFormField
                      label="Activity Level"
                      tooltip={activityLevelTooltip}
                      labelIcon={<RepeatIcon />}
                    >
                      <Select 
                        value={formData.activityLevel} 
                        onChange={(e) => handleInputChange('activityLevel', e.target.value)}
                        variant="filled"
                      >
                        <option value="">Select activity level</option>
                        <option value="sedentary">Sedentary</option>
                        <option value="lightly_active">Lightly Active</option>
                        <option value="moderately_active">Moderately Active</option>
                        <option value="very_active">Very Active</option>
                        <option value="extremely_active">Extremely Active</option>
                      </Select>
                    </LabeledFormField>
                  </GridItem>

                  <GridItem>
                    <LabeledFormField
                      label="Trail Distance (miles)"
                      tooltip={trailDistanceTooltip}
                      labelIcon={<TimeIcon />}
                    >
                      <NumberInput value={Number(formData.trailDistance) || ''} onChange={(_, v) => handleInputChange('trailDistance', v)} min={0}>
                        <NumberInputField />
                      </NumberInput>
                    </LabeledFormField>
                  </GridItem>

                  <GridItem>
                    <LabeledFormField
                      label="Total Elevation (ft)"
                      tooltip={totalElevationTooltip}
                      labelIcon={<TriangleUpIcon />}
                    >
                      <NumberInput value={Number(formData.totalElevation) || ''} onChange={(_, v) => handleInputChange('totalElevation', v)} min={0}>
                        <NumberInputField />
                      </NumberInput>
                    </LabeledFormField>
                  </GridItem>

                  <GridItem>
                    <LabeledFormField
                      label="Season"
                      tooltip={seasonTooltip}
                      labelIcon={<SunIcon />}
                    >
                      <Select 
                        value={formData.season} 
                        onChange={(e) => handleInputChange('season', e.target.value)}
                        variant="filled"
                      >
                        <option value="">Select season</option>
                        <option value="spring">Spring</option>
                        <option value="summer">Summer</option>
                        <option value="fall">Fall</option>
                        <option value="winter">Winter</option>
                      </Select>
                    </LabeledFormField>
                  </GridItem>
                </Grid>

                <Button 
                  type="submit" 
                  colorScheme="brand" 
                  size="lg" 
                  width="full"
                >
                  Calculate Calories
                </Button>
              </VStack>
            </form>
          </VStack>
        </Box>

        {/* Back: Results */}
        <Box 
          sx={flipBackStyles} 
          bg={cardBg} 
          borderRadius="lg" 
          boxShadow="lg" 
          p={8}
          border="1px solid"
          borderColor={borderColor}
        >
          <VStack spacing={6} align="stretch">
            <HStack justify="space-between">
              <Heading size="lg" color={textColor}>Your Results</Heading>
              <IconButton
                aria-label="Back to calculator"
                icon={<ArrowBackIcon />}
                onClick={handleFlipBack}
                variant="ghost"
              />
            </HStack>

            {calculationResult && (
              <>
                <StatGroup>
                  <Stat>
                    <StatLabel color={labelColor}>Total Calories</StatLabel>
                    <StatNumber color={textColor}>{formatNumber(calculationResult.total_calories)}</StatNumber>
                  </Stat>
                  <Stat>
                    <StatLabel color={labelColor}>Daily Average</StatLabel>
                    <StatNumber color={textColor}>
                      {formatNumber(Math.round(calculationResult.total_calories / calculationResult.daily_breakdown.length))}
                    </StatNumber>
                  </Stat>
                </StatGroup>

                <Table variant="simple">
                  <Thead bg={tableBg}>
                    <Tr>
                      <Th color={labelColor}>Day</Th>
                      <Th color={labelColor}>Calories</Th>
                      <Th color={labelColor}>Carbs</Th>
                      <Th color={labelColor}>Protein</Th>
                      <Th color={labelColor}>Fat</Th>
                    </Tr>
                  </Thead>
                  <Tbody>
                    {calculationResult.daily_breakdown.map((day) => (
                      <Tr key={day.day}>
                        <Td color={textColor}>{day.day}</Td>
                        <Td color={textColor}>{formatNumber(day.calories)}</Td>
                        <Td color={textColor}>{formatNumber(day.macros.carbs)}g</Td>
                        <Td color={textColor}>{formatNumber(day.macros.protein)}g</Td>
                        <Td color={textColor}>{formatNumber(day.macros.fat)}g</Td>
                      </Tr>
                    ))}
                  </Tbody>
                </Table>
              </>
            )}
          </VStack>
        </Box>
      </Box>
    </Box>
  );
};

export default QuickCalorieCalculator; 