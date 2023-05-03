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

import { screen } from '@testing-library/react';
import renderView from '../../__tests_helpers__/renderView';
import { changeInputValue } from '../../__tests_helpers__/jsDomHelpers';

import Path from '../path';
import createExtensionBridge from '../../__tests_helpers__/createExtensionBridge';

let extensionBridge;

beforeEach(() => {
  extensionBridge = createExtensionBridge();
  window.extensionBridge = extensionBridge;
});

afterEach(() => {
  delete window.extensionBridge;
});

const getFromFields = () => ({
  pathTextfield: screen.queryByLabelText(/path/i)
});

describe.skip('path data element view', () => {
  test('sets form values from settings', async () => {
    renderView(Path);

    extensionBridge.init({
      settings: {
        path: 'foo'
      }
    });

    const { pathTextfield } = getFromFields();
    expect(pathTextfield.value).toBe('foo');
  });

  test('sets settings from form values', async () => {
    renderView(Path);

    extensionBridge.init();

    const { pathTextfield } = getFromFields();
    await changeInputValue(pathTextfield, 'foo');

    expect(extensionBridge.getSettings()).toEqual({
      path: 'foo'
    });
  });

  test('sets errors if required values are not provided', async () => {
    renderView(Path);

    extensionBridge.init();

    await extensionBridge.validate();

    const { pathTextfield } = getFromFields();
    expect(pathTextfield).toHaveAttribute('aria-invalid', 'true');
  });
});
