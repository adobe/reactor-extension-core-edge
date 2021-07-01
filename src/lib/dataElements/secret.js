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

'use strict';

module.exports = ({ utils: { getBuildInfo, getSettings, getComponent } }) => {
  const { environment } = getBuildInfo();
  const { secrets = {} } = getSettings();
  const { name: dataElementName } = getComponent();

  if (secrets[environment]) {
    const { id, name } = secrets[environment];
    const secret = global[id];

    if (!secret) {
      throw new Error(
        `Could not find the secret "${name}" on the "${environment}" environment.\
 The secret "${name}" is configured inside the data element "${dataElementName}".`
      );
    }

    return secret;
  }

  throw new Error(
    `The data element "${dataElementName}" does not have a\
 secret configured for the "${environment}" environment.`
  );
};
