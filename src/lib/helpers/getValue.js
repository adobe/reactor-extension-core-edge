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

'use strict';

var isKeyArray = require('./isKeyArray');
var getArrayIndex = require('./getArrayIndex');

module.exports = function (payload, sourcePath) {
  var pathParts = sourcePath.split('.');
  var result = payload;

  pathParts.forEach(function (pathPart) {
    if (result) {
      if (isKeyArray(pathPart)) {
        var property = pathPart.substring(0, pathPart.indexOf('['));
        var index = getArrayIndex(pathPart);
        if (result[property]) {
          result = result[property][index];
        }
      } else {
        result = result[pathPart];
      }
    }
  });

  return result || null;
};
