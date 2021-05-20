/*
Copyright 2020 Adobe. All rights reserved.
This file is licensed to you under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License. You may obtain a copy
of the License at http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software distributed under
the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR REPRESENTATIONS
OF ANY KIND, either express or implied. See the License for the specific language
governing permissions and limitations under the License.
*/

import React from 'react';
import { Controller, useFormContext } from 'react-hook-form';
import {
  Item,
  Flex,
  Picker,
  Text,
  View,
  Checkbox,
  Well
} from '@adobe/react-spectrum';
import Alert from '@spectrum-icons/workflow/Alert';
import WrappedTextField from '../../components/wrappedTextField';
import RegexTestButton from '../../components/regexTestButton';
import metaByOperator from './metaByOperator';
import operators from './operators';

const operatorOptions = Object.keys(metaByOperator).map((operator) => ({
  id: operator,
  name: metaByOperator[operator].label
}));

const NoTypeConversionReminder = ({ operator, value }) => {
  const sketchyStrings = ['true', 'false', 'null', 'undefined'];

  return (operator === operators.EQUALS ||
    operator === operators.DOES_NOT_EQUAL) &&
    sketchyStrings.indexOf(value.toLowerCase()) !== -1 ? (
    <Well>
      <Flex gap="size-150">
        <Alert color="notice" />
        Be aware that the value &quot;
        {value}
        &quot; will be compared as a string.
      </Flex>
    </Well>
  ) : null;
};

const RightOperandFields = ({
  setValue,
  watch,
  operator,
  caseInsensitive,
  rightOperand
}) => {
  if (operator && metaByOperator[operator].supportsRightOperand) {
    return operator === operators.MATCHES_REGEX ||
      operator === operators.DOES_NOT_MATCH_REGEX ? (
      <Flex gap="size-100" alignItems="end">
        <View minWidth="size-4600">
          <WrappedTextField
            label="Right Operand"
            name="rightOperand"
            width="100%"
            supportDataElement
          />
        </View>

        <View marginBottom="size-200">
          <RegexTestButton
            onChange={(v) => {
              setValue('rightOperand', v, {
                shouldValidate: true,
                shouldDirty: true
              });
            }}
            value={watch('rightOperand')}
            flags={caseInsensitive ? 'i' : ''}
          />
        </View>
      </Flex>
    ) : (
      <Flex direction="column" width="size-4600">
        <WrappedTextField
          label="Right Operand"
          name="rightOperand"
          width="100%"
          supportDataElement
        />
        <NoTypeConversionReminder operator={operator} value={rightOperand} />
      </Flex>
    );
  }

  return null;
};

export default () => {
  const { control, watch, setValue } = useFormContext();

  const [operator, rightOperand, caseInsensitive] = watch([
    'operator',
    'rightOperand',
    'caseInsensitive'
  ]);

  return (
    <>
      <Flex direction="column" gap="size-150" width="size-4600">
        <Text>Return true if</Text>
        <WrappedTextField
          name="leftOperand"
          label="Left Operand"
          supportDataElement
          isRequired
          width="100%"
          necessityIndicator="label"
        />
      </Flex>

      <Flex gap="size-150" marginBottom="size-200" alignItems="end">
        <Controller
          control={control}
          defaultValue={operatorOptions[0].id}
          name="operator"
          render={({ field: { onChange, onBlur, value } }) => (
            <Picker
              label="Operator"
              minWidth="size-4600"
              items={operatorOptions}
              selectedKey={value}
              onSelectionChange={onChange}
              onBlur={onBlur}
            >
              {(item) => <Item>{item.name}</Item>}
            </Picker>
          )}
        />

        <Controller
          control={control}
          defaultValue=""
          name="caseInsensitive"
          render={({ field: { onChange, value } }) => (
            <Checkbox
              minWidth="size-2400"
              isSelected={value}
              onChange={onChange}
            >
              Case insensitive
            </Checkbox>
          )}
        />
      </Flex>

      <RightOperandFields
        watch={watch}
        operator={operator}
        setValue={setValue}
        caseInsensitive={caseInsensitive}
        rightOperand={rightOperand}
      />
    </>
  );
};
