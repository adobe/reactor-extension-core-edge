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

import { fireEvent, screen } from '@testing-library/react';
import { act } from 'react-dom/test-utils';
import renderView from '../../__tests_helpers__/renderView';

import ValueComparison from '../valueComparison';
import createExtensionBridge from '../../__tests_helpers__/createExtensionBridge';

import metaByOperator from '../valueComparison/helpers/metaByOperator';
import {
  inputOnChange,
  changePickerValue
} from '../../__tests_helpers__/jsDomHelpers';

let extensionBridge;

beforeEach(() => {
  extensionBridge = createExtensionBridge();
  window.extensionBridge = extensionBridge;
});

afterEach(() => {
  delete window.extensionBridge;
});

const getFromFields = () => ({
  leftOperandTextfield: screen.queryByLabelText(/left operand/i),
  rightOperandTextfield: screen.queryByLabelText(/right operand/i),
  operatorSelect: screen.queryByLabelText(/operator/i, {
    selector: 'button'
  }),
  caseInsensitiveCheckbox: screen.queryByLabelText(/case insensitive/i),
  noTypeConversionReminders: screen.queryByText(/be aware that the value/i)
});

describe('value comparison condition view', () => {
  beforeEach(() => {
    renderView(ValueComparison);
  });

  describe('equal-based comparisons', () => {
    ['equals', 'doesNotEqual'].forEach((operator) => {
      describe(`when operator is ${operator}`, () => {
        test('sets form values from settings ', async () => {
          await act(async () => {
            extensionBridge.init({
              settings: {
                leftOperand: '{{foo}}',
                comparison: {
                  operator,
                  caseInsensitive: true
                },
                // We're using 0 here because it also tests whether falsy values
                // are handled appropriately.
                rightOperand: 0
              }
            });
          });

          const {
            leftOperandTextfield,
            operatorSelect,
            rightOperandTextfield,
            caseInsensitiveCheckbox
          } = getFromFields();

          expect(leftOperandTextfield.value).toBe('{{foo}}');
          expect(operatorSelect).toHaveTextContent(
            metaByOperator[operator].label
          );
          expect(rightOperandTextfield.value).toBe('0');
          expect(caseInsensitiveCheckbox.checked).toBe(true);
        });

        test('sets settings from form values', async () => {
          await act(async () => {
            extensionBridge.init();
          });

          const { leftOperandTextfield, operatorSelect } = getFromFields();

          await act(async () => {
            inputOnChange(leftOperandTextfield, '{{foo}}');
            await changePickerValue(
              operatorSelect,
              metaByOperator[operator].label
            );
          });

          const { rightOperandTextfield, caseInsensitiveCheckbox } =
            getFromFields();

          await act(async () => {
            inputOnChange(rightOperandTextfield, '123');
            fireEvent.click(caseInsensitiveCheckbox);
          });

          expect(extensionBridge.getSettings()).toEqual({
            leftOperand: '{{foo}}',
            comparison: {
              operator,
              caseInsensitive: true
            },
            rightOperand: 123
          });
        });

        test('sets errors if required values are not provided', async () => {
          await act(async () => {
            extensionBridge.init({
              settings: {
                comparison: {
                  operator
                }
              }
            });
          });

          await act(async () => {
            expect(extensionBridge.validate()).resolves.toBe(false);
          });

          const { leftOperandTextfield, rightOperandTextfield } =
            getFromFields();

          expect(leftOperandTextfield).toHaveAttribute('aria-invalid', 'true');
          // We allow empty strings for equals operands because users may want to check to
          // see if a value equals an empty string.
          expect(rightOperandTextfield).not.toHaveAttribute(
            'aria-invalid',
            'true'
          );
        });
      });
    });
  });

  describe('string-based comparisons', () => {
    [
      'contains',
      'doesNotContain',
      'startsWith',
      'doesNotStartWith',
      'endsWith',
      'doesNotEndWith',
      'matchesRegex',
      'doesNotMatchRegex'
    ].forEach((operator) => {
      describe(`when operator is ${operator}`, () => {
        test('sets form values from settings ', async () => {
          await act(async () => {
            extensionBridge.init({
              settings: {
                leftOperand: '{{foo}}',
                comparison: {
                  operator,
                  caseInsensitive: true
                },
                rightOperand: 'bar'
              }
            });
          });

          const {
            leftOperandTextfield,
            operatorSelect,
            rightOperandTextfield,
            caseInsensitiveCheckbox
          } = getFromFields();

          expect(leftOperandTextfield.value).toBe('{{foo}}');
          expect(operatorSelect).toHaveTextContent(
            metaByOperator[operator].label
          );
          expect(rightOperandTextfield.value).toBe('bar');
          expect(caseInsensitiveCheckbox.checked).toBe(true);
        });

        test('sets settings from form values', async () => {
          await act(async () => {
            extensionBridge.init();
          });

          const { leftOperandTextfield, operatorSelect } = getFromFields();

          await act(async () => {
            inputOnChange(leftOperandTextfield, '{{foo}}');
            await changePickerValue(
              operatorSelect,
              metaByOperator[operator].label
            );
          });

          const { rightOperandTextfield, caseInsensitiveCheckbox } =
            getFromFields();

          await act(async () => {
            inputOnChange(rightOperandTextfield, 'bar');
            fireEvent.click(caseInsensitiveCheckbox);
          });

          expect(extensionBridge.getSettings()).toEqual({
            leftOperand: '{{foo}}',
            comparison: {
              operator,
              caseInsensitive: true
            },
            rightOperand: 'bar'
          });
        });

        test('sets errors if required values are not provided', async () => {
          await act(async () => {
            extensionBridge.init({
              settings: {
                comparison: {
                  operator
                }
              }
            });
          });

          await act(async () => {
            expect(extensionBridge.validate()).resolves.toBe(false);
          });

          const { leftOperandTextfield, rightOperandTextfield } =
            getFromFields();

          expect(leftOperandTextfield).toHaveAttribute('aria-invalid', 'true');
          expect(rightOperandTextfield).toHaveAttribute('aria-invalid', 'true');
        });
      });
    });
  });

  describe('number-based comparisons', () => {
    [
      'lessThan',
      'lessThanOrEqual',
      'greaterThan',
      'greaterThanOrEqual'
    ].forEach((operator) => {
      describe(`when operator is ${operator}`, () => {
        test('sets form values from settings', async () => {
          await act(async () => {
            extensionBridge.init({
              settings: {
                leftOperand: '{{foo}}',
                comparison: {
                  operator
                },
                rightOperand: 456
              }
            });
          });

          const {
            leftOperandTextfield,
            operatorSelect,
            rightOperandTextfield
          } = getFromFields();

          expect(leftOperandTextfield.value).toBe('{{foo}}');
          expect(operatorSelect).toHaveTextContent(
            metaByOperator[operator].label
          );
          expect(rightOperandTextfield.value).toBe('456');
        });

        test('sets settings from form values', async () => {
          await act(async () => {
            extensionBridge.init();
          });

          const { leftOperandTextfield, operatorSelect } = getFromFields();

          inputOnChange(leftOperandTextfield, '{{foo}}');
          await changePickerValue(
            operatorSelect,
            metaByOperator[operator].label
          );

          const { rightOperandTextfield } = getFromFields();

          inputOnChange(rightOperandTextfield, '456');

          expect(extensionBridge.getSettings()).toEqual({
            leftOperand: '{{foo}}',
            comparison: {
              operator
            },
            rightOperand: 456
          });
        });

        test('sets errors if required values are not provided', async () => {
          await act(async () => {
            extensionBridge.init({
              settings: {
                leftOperand: '',
                comparison: {
                  operator
                },
                rightOperand: ''
              }
            });
          });

          await act(async () => {
            expect(extensionBridge.validate()).resolves.toBe(false);
          });

          const { leftOperandTextfield, rightOperandTextfield } =
            getFromFields();

          expect(leftOperandTextfield).toHaveAttribute('aria-invalid', 'true');
          expect(rightOperandTextfield).toHaveAttribute('aria-invalid', 'true');
        });
      });
    });
  });

  describe('static right operand comparisons', () => {
    ['isTrue', 'isTruthy', 'isFalse', 'isFalsy'].forEach((operator) => {
      describe(`when operator is ${operator}`, () => {
        test('sets form values from settings', async () => {
          await act(async () => {
            extensionBridge.init({
              settings: {
                leftOperand: '{{foo}}',
                comparison: {
                  operator
                }
              }
            });
          });

          const { leftOperandTextfield, operatorSelect } = getFromFields();

          expect(leftOperandTextfield.value).toBe('{{foo}}');
          expect(operatorSelect).toHaveTextContent(
            metaByOperator[operator].label
          );
        });

        test('sets settings from form values', async () => {
          await act(async () => {
            extensionBridge.init();
          });

          const { leftOperandTextfield, operatorSelect } = getFromFields();

          inputOnChange(leftOperandTextfield, '{{foo}}');
          await changePickerValue(
            operatorSelect,
            metaByOperator[operator].label
          );

          expect(extensionBridge.getSettings()).toEqual({
            leftOperand: '{{foo}}',
            comparison: {
              operator
            }
          });
        });

        test('sets errors if required values are not provided', async () => {
          await act(async () => {
            extensionBridge.init({
              settings: {
                comparison: {
                  operator
                }
              }
            });
          });
          await act(async () => {
            expect(extensionBridge.validate()).resolves.toBe(false);
          });

          const { leftOperandTextfield } = getFromFields();

          expect(leftOperandTextfield).toHaveAttribute('aria-invalid', 'true');
        });
      });
    });
  });

  test('warns user about no type conversions for specific string values', async () => {
    await act(async () => {
      extensionBridge.init({
        settings: {
          leftOperand: '{{foo}}',
          comparison: {
            operator: 'equals',
            caseInsensitive: true
          },
          rightOperand: 'true'
        }
      });
    });

    const { noTypeConversionReminders } = getFromFields();
    expect(noTypeConversionReminders).not.toBeNull();
  });
});
