/*
Copyright 2021 Adobe. All rights reserved.
This file is licensed to you under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License. You may obtain a copy
of the License at http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software distributed under
the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR REPRESENTATIONS
OF ANY KIND, either express or implied. See the License for the specific language
governing permissions and limitations under the License.
*/

import React from 'react';
import { ProgressCircle, Flex, Heading } from '@adobe/react-spectrum';

export default function ProgressCircleView() {
  return (
    <Flex
      gap="size-200"
      width="100%"
      marginTop="size-2400"
      alignItems="center"
      justifyContent="center"
    >
      <ProgressCircle aria-label="Loading…" isIndeterminate />
      <Heading level="3">Loading...</Heading>
    </Flex>
  );
}
