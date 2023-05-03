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
  ActionButton,
  Flex,
  Text,
  Tooltip,
  TooltipTrigger,
  View
} from '@adobe/react-spectrum';
import Info from '@spectrum-icons/workflow/Info';
import EditorButton from '../../../components/editorButton';

export default function CustomCodeFields() {
  const {
    control,
    formState: { errors },
    trigger
  } = useFormContext();

  return (
    <Flex>
      <Controller
        control={control}
        defaultValue=""
        name="source"
        render={({ field: { onChange, value } }) => (
          <View>
            <EditorButton
              width="size-2000"
              onChange={(code) => {
                onChange(code);
                trigger('source');
              }}
              value={value}
              language="javascript"
              variant={errors.source ? 'negative' : 'primary'}
              placeholder={
                '// Your JS code has access to `arc` and `utils` variables. \n' +
                "// Don't forget to return a result for the condition (true or false). \n"
              }
            />
            {errors.source && (
              <View UNSAFE_className="error">
                <Text>{errors.source}</Text>
              </View>
            )}
          </View>
        )}
      />
      <TooltipTrigger delay={0} placement="bottom">
        <ActionButton aria-label="Save" isQuiet marginStart="size-50">
          <Info />
        </ActionButton>
        <Tooltip width="size-3000" UNSAFE_className="customCodeTooltip">
          Enter a script that evaluates to true or false to control whether this
          rule executes. Use this code to check for certain values (like
          shopping cart size or item price), whether a user is logged in or
          registered, or anything else you require.
        </Tooltip>
      </TooltipTrigger>
    </Flex>
  );
}
