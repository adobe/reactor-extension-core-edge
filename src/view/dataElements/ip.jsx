/*
Copyright 2023 Adobe. All rights reserved.
This file is licensed to you under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License. You may obtain a copy
of the License at http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software distributed under
the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR REPRESENTATIONS
OF ANY KIND, either express or implied. See the License for the specific language
governing permissions and limitations under the License.
*/

import React from 'react';
import { Flex, InlineAlert, Heading, Content } from '@adobe/react-spectrum';
import ExtensionView from '../components/extensionView';

export default function CustomCodeView() {
  return (
    <ExtensionView
      getInitialValues={() => ({})}
      getSettings={() => ({})}
      validate={() => ({})}
      render={() => (
        <Flex direction="column" alignItems="center">
          <InlineAlert variant="info">
            <Heading>Info</Heading>
            <Content>
              This data element will return the IP value found in one of the
              following paths: <br />
              <strong>`arc.event.xdm.environment.ipV4`</strong> or{' '}
              <strong>`arc.event.xdm.environment.ipV6`</strong>.
            </Content>
          </InlineAlert>
        </Flex>
      )}
    />
  );
}
