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
import { Item, View } from '@adobe/react-spectrum';
import { useFormContext } from 'react-hook-form';
import SecretComboBox from '../../../components/secretComboBox';

const isMissingFromSecrets = (id, secrets) => {
  return id && secrets.filter((s) => s.id === id).length === 0;
};
const addDeletedSecretsIfDoesNotExist = (secrets, name, id) => {
  if (isMissingFromSecrets(id, secrets)) {
    secrets.push({
      id,
      name,
      disabled: true,
      label: `${name} (Status: Deleted)`
    });
  }
};

export default function SecretSection({ formKeyPrefix, label, secrets }) {
  const { setValue, watch } = useFormContext();
  const secretId = watch(`${formKeyPrefix}.id`);
  const secretName = watch(`${formKeyPrefix}.name`);

  addDeletedSecretsIfDoesNotExist(secrets, secretName, secretId);

  return (
    <View minWidth="size-3000" maxWidth="size-6000">
      <SecretComboBox
        width="100%"
        label={label}
        defaultItems={secrets}
        defaultSelectedKey={secretId}
        disabledKeys={secrets.filter((s) => s.disabled).map((s) => s.id)}
        onSelectionChange={(k) => {
          setValue(`${formKeyPrefix}.id`, k);

          const name = secrets.filter((s) => s.id === k).map((s) => s.name)[0];
          setValue(`${formKeyPrefix}.name`, name);
        }}
      >
        {(item) => <Item key={item.id}>{item.label}</Item>}
      </SecretComboBox>
    </View>
  );
}
