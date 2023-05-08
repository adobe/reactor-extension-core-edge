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

/* eslint-disable jsx-a11y/anchor-is-valid */

import React, { useEffect, useState } from 'react';
import {
  Flex,
  Item,
  Picker,
  View,
  Link,
  Badge,
  Text
} from '@adobe/react-spectrum';
import Icon from '@spectrum-icons/workflow/Info';
import { Controller, useFormContext } from 'react-hook-form';
import WrappedTextField from '../../../components/wrappedTextField';
import ProgressCircle from '../../../components/progressCircle';
import ErrorMessage from '../../../components/errorMessage';
import loadExtensions from '../api/loadExtensions';
import actionSources from '../helpers/actionSources';
import WrappedComboBoxField from '../../../components/wrappedComboBox';

const getPath = (action, path, extension, extensions) => {
  let r = '';
  // eslint-disable-next-line default-case
  switch (action) {
    case 'event':
      r = `arc.event${path ? `.${path}` : ''}`;
      break;
    case 'xdm':
    case 'data':
      r = `arc.event.${action}${path ? `.${path}` : ''}`;
      break;
    case 'request':
      r = 'arc.request';
      break;
    case 'stash':
      // eslint-disable-next-line no-case-declarations
      const currentExtension = (extensions || []).filter(
        (x) => x.attributes.display_name === extension
      )[0];

      r = `arc.ruleStash${
        currentExtension ? `.${currentExtension.attributes.name}` : ``
      }${path && currentExtension ? `.${path}` : ''}`;

      break;
  }
  return r;
};

export default function PathFields({ renderedCycle }) {
  const [showProgressCircle, setShowProgressCircle] = useState(true);
  const [error, setError] = useState(false);
  const [extensions, setExtensions] = useState({});

  useEffect(() => {
    loadExtensions()
      .then((loadedExtensions) => {
        setExtensions(loadedExtensions.data);
        setShowProgressCircle(false);
      })
      .catch((e) => {
        setError(e);
      });
  }, [renderedCycle]);

  const { watch } = useFormContext();

  let action = watch('action');
  const path = watch('path');
  const extension = watch('extension');
  action = actionSources.getActionSourceId(action);

  const showPathInput = action && action !== 'request';

  return (
    <>
      {error && <ErrorMessage message={error.message} />}
      {!error && showProgressCircle && <ProgressCircle />}
      {!error && !showProgressCircle && (
        <Flex direction="column" gap="size-200">
          <View>
            Learn more about all the available{' '}
            <Link>
              <a
                href="https://experienceleague.adobe.com/docs/experience-platform/tags/extension-dev/edge/context.html?lang=en"
                rel="noreferrer"
                target="_blank"
              >
                Adobe Request Context (arc)
              </a>
            </Link>{' '}
            properties.
          </View>

          <Controller
            defaultValue=""
            name="action"
            render={({
              field: { onChange, onBlur, value },
              fieldState: { error: e }
            }) => {
              return (
                <Picker
                  label="I want to"
                  width="100%"
                  minWidth="size-3000"
                  maxWidth="size-6000"
                  items={actionSources
                    .getActionSourceNames()
                    .map((q) => ({ id: q, name: q }))}
                  selectedKey={value}
                  onSelectionChange={onChange}
                  onBlur={onBlur}
                  isRequired
                  necessityIndicator="label"
                  validationState={e ? 'invalid' : ''}
                  errorMessage={e}
                >
                  {(item) => <Item>{item.name}</Item>}
                </Picker>
              );
            }}
          />

          {action === 'stash' && (
            <WrappedComboBoxField
              name="extension"
              width="100%"
              minWidth="size-3000"
              maxWidth="size-6000"
              label="Extension"
              allowsCustomValue
              defaultItems={extensions.map((i) => ({
                id: i.attributes.name,
                name: i.attributes.display_name
              }))}
            />
          )}

          {showPathInput && (
            <WrappedTextField
              width="100%"
              minWidth="size-3000"
              maxWidth="size-6000"
              name="path"
              label="Path"
              isRequired={action === 'custom'}
              necessityIndicator={action === 'custom' && 'label'}
              description={
                action !== 'custom'
                  ? 'Add more paths segments to drill down inside the Request Context data.'
                  : ''
              }
            />
          )}

          {action && action !== 'custom' && (
            <Badge variant="info">
              <Icon aria-label="Information about field hashing" />
              <Text>
                The complete path used to find data will be:{' '}
                <strong>{getPath(action, path, extension, extensions)}</strong>
              </Text>
            </Badge>
          )}
        </Flex>
      )}
    </>
  );
}
