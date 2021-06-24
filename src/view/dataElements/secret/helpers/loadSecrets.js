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

import loadSecrets from '../api/loadSecrets';
import generateDisableFlag from './generateDisableFlag';
import generateLabel from './generateLabel';

let l;

export default () => {
  if (!l) {
    l = loadSecrets().then((response) =>
      response.data
        .map(
          ({
            id,
            attributes: { name, status, refresh_at: refreshAt },
            relationships: {
              environment: { meta: { stage: environmentType } = {} }
            },
            meta: { refresh_status: refreshStatus } = {}
          }) => ({
            id,
            name,
            environmentType,
            disabled: generateDisableFlag({ status }),
            label: generateLabel({
              name,
              status,
              refreshStatus,
              refreshAt
            })
          })
        )
        .reduce(
          (acc, curr) => {
            if (curr.environmentType) {
              acc[curr.environmentType].push(curr);
            }
            return acc;
          },
          { development: [], staging: [], production: [] }
        )
    );
  }

  return l;
};
