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
import { act } from 'react-dom/test-utils';
import renderView from '../../__tests_helpers__/renderView';
import { changeComboBoxValue } from '../../__tests_helpers__/jsDomHelpers';

import Secret from '../secret';
import createExtensionBridge from '../../__tests_helpers__/createExtensionBridge';

let extensionBridge;

jest.mock('../secret/api/loadSecrets');

beforeEach(() => {
  extensionBridge = createExtensionBridge();
  window.extensionBridge = extensionBridge;
  renderView(Secret);
});

afterEach(() => {
  delete window.extensionBridge;
});

afterAll(() => {
  jest.restoreAllMocks();
});

const getFromFields = () => ({
  developmentSecretComboBox: screen.getByLabelText(/development secret/i, {
    selector: 'input'
  }),
  stagingSecretComboBox: screen.getByLabelText(/staging secret/i, {
    selector: 'input'
  }),
  productionSecretComboBox: screen.getByLabelText(/production secret/i, {
    selector: 'input'
  })
});

describe('secret data element view', () => {
  test('sets form values from settings', async () => {
    await act(async () => {
      extensionBridge.init({
        settings: {
          secrets: {
            production: {
              id: 'SE880f853f4ef34ec8ab9b11055f0c2b1f',
              name: 'mysecret_in_production'
            },
            staging: {
              id: 'SE0d2e90a2d98b4a6db1560aae3f4ec7bd',
              name: 'all success'
            },
            development: {
              id: 'SEe853134cef234423ba68afca46696b02',
              name: 'mysecret7'
            }
          }
        }
      });
    });

    const {
      developmentSecretComboBox,
      stagingSecretComboBox,
      productionSecretComboBox
    } = getFromFields();

    expect(developmentSecretComboBox.value).toBe('mysecret7');
    expect(stagingSecretComboBox.value).toBe('all success');
    expect(productionSecretComboBox.value).toBe('mysecret_in_production');
  });

  test('sets settings from form values', async () => {
    await act(async () => {
      extensionBridge.init();
    });

    const {
      developmentSecretComboBox,
      stagingSecretComboBox,
      productionSecretComboBox
    } = getFromFields();

    await changeComboBoxValue(developmentSecretComboBox, 'mysecret7');
    await changeComboBoxValue(stagingSecretComboBox, 'all success');
    await changeComboBoxValue(
      productionSecretComboBox,
      'mysecret_in_production'
    );

    expect(extensionBridge.getSettings()).toEqual({
      secrets: {
        development: {
          id: 'SEe853134cef234423ba68afca46696b02',
          name: 'mysecret7'
        },
        staging: {
          id: 'SE0d2e90a2d98b4a6db1560aae3f4ec7bd',
          name: 'all success'
        },
        production: {
          id: 'SE880f853f4ef34ec8ab9b11055f0c2b1f',
          name: 'mysecret_in_production'
        }
      }
    });
  });

  test('marks an unexisting secret as deleted inside the combobox', async () => {
    await act(async () => {
      extensionBridge.init({
        settings: {
          secrets: {
            development: {
              id: 'SE123',
              name: 'other'
            }
          }
        }
      });
    });

    const { developmentSecretComboBox } = getFromFields();
    expect(developmentSecretComboBox.value).toBe('other (Status: Deleted)');
  });
});
