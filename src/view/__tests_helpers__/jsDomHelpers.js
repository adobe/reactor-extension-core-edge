/*
Copyright 2022 Adobe. All rights reserved.
This file is licensed to you under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License. You may obtain a copy
of the License at http://www.apache.org/licenses/LICENSE-2.0
Unless required by applicable law or agreed to in writing, software distributed under
the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR REPRESENTATIONS
OF ANY KIND, either express or implied. See the License for the specific language
governing permissions and limitations under the License.
*/

/* istanbul ignore file */

// eslint-disable-next-line import/no-extraneous-dependencies
// import { prettyDOM } from '@testing-library/dom';
import { fireEvent, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

export const changePickerValue = async (pickerTrigger, value) => {
  fireEvent.click(pickerTrigger);

  const option = await screen.findByRole('option', { name: value });
  fireEvent.click(option);

  await waitFor(() => {
    if (
      // eslint-disable-next-line testing-library/no-node-access
      document.getElementById('root').getAttribute('aria-hidden') === 'true'
    ) {
      throw new Error('Picker value not changed yet');
    }
  });
};

export const changeInputValue = async (input, value) => {
  await userEvent.clear(input);
  if (value) {
    await userEvent.type(input, value);
  }
};

export const changeComboboxValue = async (input, value) => {
  fireEvent.change(input, { target: { value } });
};

export const click = async (newTab) => {
  await userEvent.click(newTab);
};

export const getTextFieldByLabel = (label) => screen.getByLabelText(label);
export const queryTextFieldByLabel = (label) => screen.queryByLabelText(label);

export const findComboBoxOption = async (comboboxInput, optionText) => {
  await userEvent.type(comboboxInput, optionText);

  const items = await screen.findAllByRole('option');
  return items.filter((o) => o.textContent === optionText)[0];
};

export const changeComboBoxValue = async (comboboxInput, newValue) => {
  const option = await findComboBoxOption(comboboxInput, newValue);
  userEvent.click(option);
};
