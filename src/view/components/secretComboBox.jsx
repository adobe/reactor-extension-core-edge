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

/* eslint-disable react/jsx-props-no-spreading */

import React from 'react';
import { ComboBox, Item } from '@adobe/react-spectrum';
import { useTreeData } from 'react-stately';

export default function WrappedComboBoxField({
  onSelectionChange: componentOnSelectionChange,
  onInputChange: componentOnInputChange,
  onBlur: componentOnBlur,
  supportDataElement,
  defaultItems = [],
  width = 'auto',
  ...rest
}) {
  const list = useTreeData({
    initialItems: defaultItems
  });

  const initialValue = list.getItem(rest.defaultSelectedKey)?.value.label || '';

  const [fieldState, setFieldState] = React.useState({
    selectedKey: list.getItem(rest.defaultSelectedKey)?.value.id || '',
    inputValue: initialValue
  });

  const onInputChange = (v) => {
    setFieldState((prevState) => ({
      inputValue: v,
      selectedKey: v === '' ? null : prevState.selectedKey
    }));

    if (componentOnInputChange) {
      componentOnInputChange(v);
    }
  };

  return (
    <ComboBox
      {...rest}
      width={width}
      onBlur={(e) => {
        if (componentOnBlur) {
          componentOnBlur(e);
        }
      }}
      defaultItems={list.items}
      selectedKey={fieldState.selectedKey}
      inputValue={fieldState.inputValue}
      onSelectionChange={(key) => {
        setFieldState((prevState) => {
          const inputValue =
            list.getItem(key)?.value.label ??
            (rest.allowsCustomValue ? prevState.inputValue : '');
          return {
            inputValue,
            selectedKey: key
          };
        });

        if (componentOnSelectionChange) {
          componentOnSelectionChange(key);
        }
      }}
      onInputChange={onInputChange}
    >
      {(item) => <Item>{item.value.name}</Item>}
    </ComboBox>
  );
}
