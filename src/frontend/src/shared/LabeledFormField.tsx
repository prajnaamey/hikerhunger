import React from 'react';
import { FormControl, FormLabel, Tooltip, HStack, Text } from '@chakra-ui/react';
import { InfoIcon } from '@chakra-ui/icons';

interface LabeledFormFieldProps {
  label: string;
  tooltip?: React.ReactNode;
  children: React.ReactNode;
  isRequired?: boolean;
  labelIcon?: React.ReactNode;
  labelProps?: object;
  formControlProps?: object;
}

export const LabeledFormField: React.FC<LabeledFormFieldProps> = ({
  label,
  tooltip,
  children,
  isRequired = false,
  labelIcon,
  labelProps = {},
  formControlProps = {},
}) => (
  <FormControl isRequired={isRequired} {...formControlProps}>
    <FormLabel {...labelProps} mb={1}>
      <HStack spacing={2}>
        {labelIcon}
        <Text>{label}</Text>
        {tooltip && (
          <Tooltip label={tooltip} placement="top">
            <span>
              <InfoIcon color="brand.500" />
            </span>
          </Tooltip>
        )}
      </HStack>
    </FormLabel>
    {children}
  </FormControl>
); 