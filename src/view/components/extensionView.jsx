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

/* eslint-disable react/forbid-prop-types */
/* eslint-disable react/require-default-props */

import React, { useEffect, useState } from 'react';
import { useForm, FormProvider } from 'react-hook-form';
import { View } from '@adobe/react-spectrum';
import PropTypes from 'prop-types';
import ErrorBoundary from './errorBoundary';
import { updateFetchSettings } from '../utils/fetch';
// import DisplayFormState from './displayFormState';

const generateNewKey = (() => {
  let k = 0;

  return () => {
    k += 1;
    return k;
  };
})();

const forceUpdate = (() => {
  let generateNewKeyNextTime = false;

  return (setKey) => {
    if (generateNewKeyNextTime) {
      setKey(generateNewKey());
    } else {
      generateNewKeyNextTime = true;
    }
  };
})();

const ExtensionView = ({ getInitialValues, getSettings, validate, render }) => {
  const [isInitialized, setIsInitialized] = useState(false);
  const [key, setKey] = useState(generateNewKey());

  const methods = useForm({
    mode: 'onTouched',
    shouldUnregister: false,
    resolver: (values) => ({ values, errors: validate(values) })
  });

  useEffect(() => {
    let initInfo;

    window.extensionBridge.register({
      init: (_initInfo = {}) => {
        initInfo = _initInfo;

        const initialValues = getInitialValues({ initInfo: _initInfo });

        Object.keys(initialValues || {}).forEach((k) => {
          methods.setValue(k, initialValues[k], {
            shouldValidate: false,
            shouldDirty: false
          });
        });

        updateFetchSettings({
          imsOrgId: initInfo.company.orgId,
          token: initInfo.tokens.imsAccess,
          propertyId: initInfo.propertySettings.id
        });

        methods.clearErrors();
        setIsInitialized(true);

        // We want to rerender the component on every
        // init call after the initial one.
        forceUpdate(setKey);
      },

      getSettings: () =>
        getSettings({
          values: methods.getValues(),
          initInfo
        }),

      validate: () => methods.trigger()
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return isInitialized ? (
    <View margin="size-200" key={key}>
      <ErrorBoundary>
        <FormProvider
          // eslint-disable-next-line react/jsx-props-no-spreading
          {...methods}
        >
          <form>{render()}</form>
          {/* <DisplayFormState /> */}
        </FormProvider>
      </ErrorBoundary>
    </View>
  ) : null;
};

ExtensionView.propTypes = {
  getInitialValues: PropTypes.func.isRequired,
  getSettings: PropTypes.func.isRequired,
  validate: PropTypes.func,
  validationSchema: PropTypes.object,
  render: PropTypes.func.isRequired
};

export default ExtensionView;
