/***************************************************************************************
 * Copyright 2019 Adobe. All rights reserved.
 * This file is licensed to you under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License. You may obtain a copy
 * of the License at http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software distributed under
 * the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR REPRESENTATIONS
 * OF ANY KIND, either express or implied. See the License for the specific language
 * governing permissions and limitations under the License.
 ****************************************************************************************/

'use strict';

const path = require('../path');
const arc = require('../../__tests__helpers__/arc');

describe('path data element delegate', function () {
  it('returns the value of a path', function () {
    var settings = {
      path: 'arc.event.data.nonXdmKey'
    };

    expect(path({ arc, utils: { getSettings: () => settings } })).toBe(
      'nonXdmValue'
    );
  });

  it('returns undefined if the path is not set', function () {
    var settings = {
      path: 'unicorn'
    };

    expect(path({ arc, utils: { getSettings: () => settings } })).toBe(null);
  });
});
