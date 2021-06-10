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

import loadSecrets from '../loadSecrets';
import { updateFetchSettings } from '../../../../utils/fetch';

let nativeFetch;

beforeAll(() => {
  nativeFetch = window.fetch;
  updateFetchSettings({ token: 'token', imsOrgId: 'orgId', propertyId: '123' });
});

afterAll(() => {
  window.fetch = nativeFetch;
  jest.restoreAllMocks();
});

describe('load secrets function', () => {
  afterEach(() => {
    window.fetch.mockReset();
  });

  test('makes a fetch call with the property id added inside the URL', () => {
    window.fetch = jest.fn(() =>
      Promise.resolve({
        ok: true,
        json: () => Promise.resolve(['a', 'b', 'c'])
      })
    );

    expect(loadSecrets()).resolves.toEqual(['a', 'b', 'c']);
    expect(window.fetch.mock.calls[0][0]).toMatch(
      /^https:\/\/reactor-dev\.adobe\.io\/properties\/123/
    );
  });
});
