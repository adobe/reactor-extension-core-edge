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
import { Text, View } from '@adobe/react-spectrum';
import EditorButton from '../../../components/editorButton';

export default () => {
  const {
    control,
    formState: { errors },
    trigger
  } = useFormContext();

  return (
    <Controller
      control={control}
      name="source"
      defaultValue=""
      render={({ field: { onChange, value } }) => (
        <>
          <EditorButton
            onChange={(code) => {
              onChange(code);
              trigger('source');
            }}
            value={value}
            language="javascript"
            variant={errors.source ? 'negative' : 'primary'}
            placeholder={
              '// Your JS code has access to `arc` and `utils` variables. \n' +
              "// Don't forget to return your data element value. \n"
            }
          />
          {errors.source && (
            <View UNSAFE_className="error">
              <Text>{errors.source}</Text>
            </View>
          )}
        </>
      )}
    />
  );
};
