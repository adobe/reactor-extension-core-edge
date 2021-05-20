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
  openEditorButton: screen.queryByText(/open editor/i),
  openEditorButtonErrorMessage: screen.queryByText(
    /please provide a custom script/i
  )
});

describe('custom code data element view', () => {
  beforeEach(() => {
    renderView(CustomCode);
  });

  test('sets errors if required values are not provided', async () => {
    await act(async () => {
      extensionBridge.init();
    });

    await act(async () => {
      extensionBridge.validate();
    });

    const { openEditorButtonErrorMessage } = getFromFields();
    expect(openEditorButtonErrorMessage).not.toBeNull();
  });

  test('allows user to provide custom code', async () => {
    await act(async () => {
      extensionBridge.init({
        settings: {
          source: 'foo'
        }
      });
    });

    const { openEditorButton } = getFromFields();

    await act(async () => {
      fireEvent.click(openEditorButton);
    });

    expect(extensionBridge.getSettings()).toEqual({
      source: 'foo + modified code'
    });
  });
});
