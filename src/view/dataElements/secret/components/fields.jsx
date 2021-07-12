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

import React, { useEffect, useState } from 'react';
import { Flex } from '@adobe/react-spectrum';
import ProgressCircle from '../../../components/progressCircle';
import ErrorMessage from '../../../components/errorMessage';
import groupSecretsByStage from '../helpers/groupSecretsByStage';
import loadSecrets from '../api/loadSecrets';
import SecretsSection from './secretsSection';

export default ({ renderedCycle }) => {
  const [showProgressCircle, setShowProgressCircle] = useState(true);
  const [error, setError] = useState(false);
  const [secrets, setSecrets] = useState({});

  useEffect(() => {
    loadSecrets()
      .then(groupSecretsByStage)
      .then((loadedSecrets) => {
        setSecrets(loadedSecrets);
        setShowProgressCircle(false);
      })
      .catch((e) => {
        setError(e);
      });
  }, [renderedCycle]);

  return (
    <>
      {error && <ErrorMessage message={error.message} />}
      {!error && showProgressCircle && <ProgressCircle />}
      {!error && !showProgressCircle && (
        <Flex direction="column" gap="size-150">
          <SecretsSection
            label="Development Secret"
            formKeyPrefix="secrets.development"
            secrets={secrets.development}
          />
          <SecretsSection
            label="Staging Secret"
            formKeyPrefix="secrets.staging"
            secrets={secrets.staging}
          />
          <SecretsSection
            label="Production Secret"
            formKeyPrefix="secrets.production"
            secrets={secrets.production}
          />
        </Flex>
      )}
    </>
  );
};
