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

import operators from './operators';

export default {
  [operators.EQUALS]: {
    // We don't have isRightOperandLengthRequired set to true for the equals operator because
    // creating a comparison to determine if a value equals an empty string is a legit
    // use case.
    label: 'Equals',
    supportsCaseSensitivity: true,
    supportsRightOperand: true,
    saveOperandAsNumberWhenPossible: true
  },
  [operators.DOES_NOT_EQUAL]: {
    // We don't have isRightOperandLengthRequired set to true for the doesNotEqual operator because
    // We don't have isRightOperandLengthRequired set to true for the doesNotEqual operator because
    // creating a comparison to determine if a value does not equal an empty string is a legit
    // use case.
    label: 'Does Not Equal',
    supportsCaseSensitivity: true,
    supportsRightOperand: true,
    saveOperandAsNumberWhenPossible: true
  },
  [operators.CONTAINS]: {
    label: 'Contains',
    supportsCaseSensitivity: true,
    supportsRightOperand: true,
    rightOperandMustBeNonEmptyString: true
  },
  [operators.DOES_NOT_CONTAIN]: {
    label: 'Does Not Contain',
    supportsCaseSensitivity: true,
    supportsRightOperand: true,
    rightOperandMustBeNonEmptyString: true
  },
  [operators.STARTS_WITH]: {
    label: 'Starts With',
    supportsCaseSensitivity: true,
    supportsRightOperand: true,
    rightOperandMustBeNonEmptyString: true
  },
  [operators.DOES_NOT_START_WITH]: {
    label: 'Does Not Start With',
    supportsCaseSensitivity: true,
    supportsRightOperand: true,
    rightOperandMustBeNonEmptyString: true
  },
  [operators.ENDS_WITH]: {
    label: 'Ends With',
    supportsCaseSensitivity: true,
    supportsRightOperand: true,
    rightOperandMustBeNonEmptyString: true
  },
  [operators.DOES_NOT_END_WITH]: {
    label: 'Does Not End With',
    supportsCaseSensitivity: true,
    supportsRightOperand: true,
    rightOperandMustBeNonEmptyString: true
  },
  [operators.MATCHES_REGEX]: {
    label: 'Matches Regex',
    supportsCaseSensitivity: true,
    supportsRightOperand: true,
    rightOperandMustBeNonEmptyString: true
  },
  [operators.DOES_NOT_MATCH_REGEX]: {
    label: 'Does Not Match Regex',
    supportsCaseSensitivity: true,
    supportsRightOperand: true,
    rightOperandMustBeNonEmptyString: true
  },
  [operators.LESS_THAN]: {
    label: 'Is Less Than',
    supportsRightOperand: true,
    saveOperandAsNumberWhenPossible: true,
    rightOperandMustBeNumberOrDataElement: true
  },
  [operators.LESS_THAN_OR_EQUAL]: {
    label: 'Is Less Than Or Equal To',
    supportsRightOperand: true,
    saveOperandAsNumberWhenPossible: true,
    rightOperandMustBeNumberOrDataElement: true
  },
  [operators.GREATER_THAN]: {
    label: 'Is Greater Than',
    supportsRightOperand: true,
    saveOperandAsNumberWhenPossible: true,
    rightOperandMustBeNumberOrDataElement: true
  },
  [operators.GREATER_THAN_OR_EQUAL]: {
    label: 'Is Greater Than Or Equal To',
    supportsRightOperand: true,
    saveOperandAsNumberWhenPossible: true,
    rightOperandMustBeNumberOrDataElement: true
  },
  [operators.IS_TRUE]: {
    label: 'Is True'
  },
  [operators.IS_TRUTHY]: {
    label: 'Is Truthy'
  },
  [operators.IS_FALSE]: {
    label: 'Is False'
  },
  [operators.IS_FALSY]: {
    label: 'Is Falsy'
  }
};
