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

const secret = require('../secret');
const arc = require('../../__tests__helpers__/arc');

describe('secret data element delegate', function () {
  it('returns the value of a secret', function () {
    var settings = {
      secrets: {
        development: { id: 'ID123' }
      }
    };

    expect(
      secret({
        arc,
        utils: {
          getSettings: () => settings,
          getBuildInfo: () => ({ environment: 'development' }),
          getComponent: () => ({}),
          getEnv: () => ({ ID123: 'ABC' })
        }
      })
    ).toBe('ABC');
  });

  it('throws an error if no secret config exists for the current environment', function () {
    var settings = {};

    expect(() => {
      secret({
        arc,
        utils: {
          getSettings: () => settings,
          getBuildInfo: () => ({ environment: 'development' }),
          getComponent: () => ({ name: 'DE1' }),
          getEnv: () => ({})
        }
      });
    }).toThrow(
      'The data element "DE1" does not have a secret configured for the "development" environment.'
    );
  });

  it('throws an error if secret is not present in the current environment', function () {
    var settings = {
      secrets: {
        development: { id: 'ID123', name: 'Secret 1' }
      }
    };

    expect(() => {
      secret({
        arc,
        utils: {
          getSettings: () => settings,
          getBuildInfo: () => ({ environment: 'development' }),
          getComponent: () => ({ name: 'DE1' }),
          getEnv: () => ({})
        }
      });
    }).toThrow(
      'Could not find the secret "Secret 1" on the "development" environment.' +
        ' The secret "Secret 1" is configured inside the data element "DE1".'
    );
  });
});
