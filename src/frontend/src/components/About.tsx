import React from 'react';
import { Box, Container, Heading, Text, VStack, useColorModeValue } from '@chakra-ui/react';

const About: React.FC = () => {
  const bgColor = useColorModeValue('gray.50', 'gray.900');
  const textColor = useColorModeValue('gray.800', 'white');

  return (
    <Box bg={bgColor} minH="100vh" py={20}>
      <Container maxW="container.md">
        <VStack spacing={8} align="center" textAlign="center">
          <Heading as="h1" size="2xl" fontWeight="extrabold" color="brand.600">
            About HikerHunger
          </Heading>
          <Text fontSize="lg" color={textColor}>
            We're Prajna and Sanath—two outdoor enthusiasts who love backpacking, but hated the hassle of meal planning. After too many trips lugging around extra food (and extra weight), we built a spreadsheet to help us pack smarter. But even that became a chore.
          </Text>
          <Text fontSize="lg" color={textColor}>
            Friends started asking us to share our spreadsheet so they could calculate their own food needs, but we realized it just wasn't intuitive or easy for others to use. That inspired us to build something better.
          </Text>
          <Text fontSize="lg" color={textColor}>
            So we created HikerHunger: a simple, intuitive tool that combines our research, experience, and all the little factors we wish we'd known about when we started. Our goal is to help you spend less time planning and more time enjoying the trail—with just the right amount of food in your pack.
          </Text>
          <Text fontSize="lg" color={textColor}>
            HikerHunger uses your trip details and personal metrics to recommend exactly what you need—no more, no less. We hope it makes your adventures lighter, easier, and a little more delicious!
          </Text>
        </VStack>
      </Container>
    </Box>
  );
};

export default About; 