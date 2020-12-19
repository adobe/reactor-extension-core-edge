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

import metaByOperator from './metaByOperator';
import { isDataElementToken, isNumberLike } from '../../utils/validators';

export default (values) => {
  const errors = {};

  if (!isDataElementToken(values.leftOperand)) {
    errors.leftOperand = 'Please specify a data element';
  }

  if (values.operator) {
    const operatorMeta = metaByOperator[values.operator];

    if (operatorMeta.rightOperandMustBeNonEmptyString && !values.rightOperand) {
      errors.rightOperand = 'Please specify a value';
    }

    if (
      operatorMeta.rightOperandMustBeNumberOrDataElement &&
      !isNumberLike(values.rightOperand) &&
      !isDataElementToken(values.rightOperand)
    ) {
      errors.rightOperand = 'Please specify a number or data element';
    }
  }

  return errors;
};
