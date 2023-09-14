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

import generateDisableFlag from './generateDisableFlag';
import generateLabel from './generateLabel';

export default (response) => {
  const secrets = response.data;
  const deployments = response.included || [];
  return deployments
    .map(
      ({
        attributes: { status },
        relationships: {
          secret: {
            data: { id: secretId }
          },
          environment: {
            meta: { stage: environmentType }
          }
        }
      }) => {
        const secret = secrets.find((s) => s.id === secretId);
        return {
          id: secret.id,
          name: secret.attributes.name,
          environmentType,
          disabled: generateDisableFlag({ status }),
          label: generateLabel({
            name: secret.attributes.name,
            status,
            refreshStatus: secret?.meta?.refresh_status,
            refreshAt: secret?.attributes?.refresh_at
          })
        };
      }
    )
    .reduce(
      (acc, curr) => {
        if (curr.environmentType) {
          acc[curr.environmentType].push(curr);
        }
        return acc;
      },
      { development: [], staging: [], production: [] }
    );
};
