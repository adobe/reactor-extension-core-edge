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
import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import renderView from '../../__tests_helpers__/renderView';
import WrappedTextField from '../wrappedTextField';
import ExtensionView from '../extensionView';

import createExtensionBridge from '../../__tests_helpers__/createExtensionBridge';

let extensionBridge;

beforeEach(() => {
  extensionBridge = createExtensionBridge();
  window.extensionBridge = extensionBridge;
});

afterEach(() => {
  delete window.extensionBridge;
});

describe('wrapped text field', () => {
  test('data element button adds a data element to the associated field', async () => {
    renderView(() => (
      <ExtensionView
        getInitialValues={() => ({ test: '' })}
        getSettings={() => ({})}
        validate={() => ({})}
        render={() => (
          <WrappedTextField name="test" label="test" supportDataElement />
        )}
      />
    ));

    await extensionBridge.init();

    const input = screen.getByRole('textbox');
    const dataElementButton = screen.getByRole('button');

    await userEvent.click(dataElementButton);

    expect(input).toHaveValue('%data element name%');
  });
});
