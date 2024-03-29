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
import { changeInputValue, click } from '../../__tests_helpers__/jsDomHelpers';

import CustomCode from '../customCode';
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
  keyNameTextfield: screen.queryByLabelText(/key name/i),
  openEditorButton: screen.queryByText(/open editor/i),
  openEditorButtonErrorMessage: screen.queryByText(
    /please provide a custom script/i
  )
});

describe('custom code action view', () => {
  test('sets form values from settings', async () => {
    renderView(CustomCode);

    await extensionBridge.init({
      settings: {
        keyname: 'key',
        source: 'bar'
      }
    });

    let { keyNameTextfield } = getFromFields();

    expect(keyNameTextfield.value).toBe('');

    await extensionBridge.init({
      settings: {
        keyName: 'name',
        source: 'bar'
      }
    });

    ({ keyNameTextfield } = getFromFields());

    expect(keyNameTextfield.value).toBe('name');
  });

  test('sets settings from form values', async () => {
    renderView(CustomCode);

    await extensionBridge.init();

    const { keyNameTextfield } = getFromFields();
    await changeInputValue(keyNameTextfield, 'name');

    expect(extensionBridge.getSettings()).toEqual({
      keyName: 'name',
      source: ''
    });
  });

  test('sets errors if required values are not provided', async () => {
    renderView(CustomCode);

    await extensionBridge.init();

    await extensionBridge.validate();

    const { openEditorButtonErrorMessage, keyNameTextfield } = getFromFields();

    expect(keyNameTextfield).toHaveAttribute('aria-invalid', 'true');
    expect(openEditorButtonErrorMessage).not.toBeNull();
  });

  test('allows user to provide custom code', async () => {
    renderView(CustomCode);

    await extensionBridge.init({
      settings: {
        keyName: 'name',
        source: 'foo'
      }
    });

    const { openEditorButton } = getFromFields();
    await click(openEditorButton);

    expect(extensionBridge.getSettings()).toEqual({
      keyName: 'name',
      source: 'foo + modified code'
    });
  });
});
