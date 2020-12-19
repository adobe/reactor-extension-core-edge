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

/*eslint eqeqeq:0*/
'use strict';

// isFinite weeds out NaNs.
const isNumber = (value) => typeof value === 'number' && isFinite(value);

const isString = (value) =>
  typeof value === 'string' || value instanceof String;

const updateCase = (operand, caseInsensitive) =>
  caseInsensitive && isString(operand) ? operand.toLowerCase() : operand;

const castToStringIfNumber = (operand) =>
  isNumber(operand) ? String(operand) : operand;

const castToNumberIfString = (operand) =>
  isString(operand) ? Number(operand) : operand;

const guardStringCompare = (compare) => (
  leftOperand,
  rightOperand,
  caseInsensitive
) => {
  leftOperand = castToStringIfNumber(leftOperand);
  rightOperand = castToStringIfNumber(rightOperand);

  return (
    isString(leftOperand) &&
    isString(rightOperand) &&
    compare(leftOperand, rightOperand, caseInsensitive)
  );
};

const guardNumberCompare = (compare) => (leftOperand, rightOperand) => {
  leftOperand = castToNumberIfString(leftOperand);
  rightOperand = castToNumberIfString(rightOperand);

  return (
    isNumber(leftOperand) &&
    isNumber(rightOperand) &&
    compare(leftOperand, rightOperand)
  );
};

const guardCaseSensitivity = (compare) => (
  leftOperand,
  rightOperand,
  caseInsensitive
) => {
  return compare(
    updateCase(leftOperand, caseInsensitive),
    updateCase(rightOperand, caseInsensitive)
  );
};

const conditions = {
  equals: guardCaseSensitivity(
    (leftOperand, rightOperand) => leftOperand == rightOperand
  ),
  doesNotEqual: (...args) => !conditions.equals(...args),
  contains: guardStringCompare(
    guardCaseSensitivity(
      (leftOperand, rightOperand) => leftOperand.indexOf(rightOperand) !== -1
    )
  ),
  doesNotContain: (...args) => !conditions.contains(...args),
  startsWith: guardStringCompare(
    guardCaseSensitivity(
      (leftOperand, rightOperand) => leftOperand.indexOf(rightOperand) === 0
    )
  ),
  doesNotStartWith: (...args) => !conditions.startsWith(...args),
  endsWith: guardStringCompare(
    guardCaseSensitivity(
      (leftOperand, rightOperand) =>
        leftOperand.substring(
          leftOperand.length - rightOperand.length,
          leftOperand.length
        ) === rightOperand
    )
  ),
  doesNotEndWith: (...args) => !conditions.endsWith(...args),
  matchesRegex: guardStringCompare(
    (leftOperand, rightOperand, caseInsensitive) => {
      // Doing something like new RegExp(/ab+c/, 'i') throws an error in some browsers (e.g., IE11),
      // so we don't want to instantiate the regex until we know we're working with a string.
      return new RegExp(rightOperand, caseInsensitive ? 'i' : '').test(
        leftOperand
      );
    }
  ),
  doesNotMatchRegex: (...args) => !conditions.matchesRegex(...args),
  lessThan: guardNumberCompare(
    (leftOperand, rightOperand) => leftOperand < rightOperand
  ),
  lessThanOrEqual: guardNumberCompare(
    (leftOperand, rightOperand) => leftOperand <= rightOperand
  ),
  greaterThan: guardNumberCompare(
    (leftOperand, rightOperand) => leftOperand > rightOperand
  ),
  greaterThanOrEqual: guardNumberCompare(
    (leftOperand, rightOperand) => leftOperand >= rightOperand
  ),
  isTrue: (leftOperand) => leftOperand === true,
  isTruthy: (leftOperand) => Boolean(leftOperand),
  isFalse: (leftOperand) => leftOperand === false,
  isFalsy: (leftOperand) => !leftOperand
};

module.exports = ({ utils: { getSettings } }) => {
  const settings = getSettings();

  return conditions[settings.comparison.operator](
    settings.leftOperand,
    settings.rightOperand,
    Boolean(settings.comparison.caseInsensitive)
  );
};
