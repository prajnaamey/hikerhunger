import React from 'react';
import { Box } from '@chakra-ui/react';

export const activityLevelTooltip = (
  <Box>
    <b>Your daily activity level affects your base metabolic rate:</b>
    <ul style={{ margin: 0, paddingLeft: '1.2em' }}>
      <li><b>Sedentary:</b> Little or no exercise</li>
      <li><b>Lightly Active:</b> Light exercise 1-3 days/week</li>
      <li><b>Moderately Active:</b> Moderate exercise 3-5 days/week</li>
      <li><b>Very Active:</b> Hard exercise 6-7 days/week</li>
      <li><b>Extra Active:</b> Very hard exercise & physical job</li>
    </ul>
  </Box>
);

export const weightTooltip = 'Your current body weight in pounds';
export const heightTooltip = 'Your height in feet and inches';
export const genderTooltip = 'Your gender affects basal metabolic rate calculations';
export const trailDistanceTooltip = 'Total distance of your hiking trail in miles';
export const totalElevationTooltip = 'Total elevation gain during your hike in feet';
export const seasonTooltip = 'The season affects temperature and weather conditions';
export const averageTemperatureTooltip = 'Expected average temperature during your hike';
export const precipitationChanceTooltip = 'Probability of rain or snow during your hike';
export const peakAltitudeTooltip = "Highest elevation you'll reach during the hike";
export const baseWeightTooltip = (
  <Box>
    Weight of your pack without food and water. This includes:
    <ul style={{ margin: 0, paddingLeft: '1.2em' }}>
      <li>Backpack</li>
      <li>Tent/Shelter</li>
      <li>Sleeping bag</li>
      <li>Sleeping pad</li>
      <li>Cooking gear</li>
      <li>Other equipment</li>
    </ul>
  </Box>
);
export const waterWeightTooltip = (
  <Box>
    Weight of water you plan to carry. Remember:
    <ul style={{ margin: 0, paddingLeft: '1.2em' }}>
      <li>1 liter of water = 2.2 lbs</li>
      <li>Plan for 2-4 liters per day</li>
      <li>Consider water sources along the trail</li>
    </ul>
  </Box>
);
export const hikerExperienceTooltip = (
  <Box>
    Your hiking experience level affects calorie calculations:
    <ul style={{ margin: 0, paddingLeft: '1.2em' }}>
      <li>Beginner: First few hikes</li>
      <li>Intermediate: Regular hiker</li>
      <li>Advanced: Experienced hiker</li>
      <li>Expert: Professional/Guide</li>
    </ul>
  </Box>
); 