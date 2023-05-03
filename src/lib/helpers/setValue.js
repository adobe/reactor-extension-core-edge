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

var isKeyArray = require('./isKeyArray');
var getArrayIndex = require('./getArrayIndex');

module.exports = function (payload, destinationPath, value) {
  var path = destinationPath.split('.');
  var currentNode = payload;
  var parentNode = null;
  var currentKey = null;
  var untouchedCurrentKey = null;

  path.forEach(function (i, currentPosition, allElements) {
    var defaultValue = {};
    if (isKeyArray(i)) {
      defaultValue = [];
    }

    parentNode = currentNode;
    untouchedCurrentKey = i;
    if (i.indexOf('[') !== -1) {
      i = i.substring(0, i.indexOf('['));
    }
    currentKey = i;

    currentNode[i] = currentNode[i] || defaultValue;

    if (Array.isArray(currentNode[i])) {
      if (allElements[currentPosition + 1]) {
        var arrayIndex = getArrayIndex(untouchedCurrentKey);
        if (arrayIndex) {
          currentNode[i][arrayIndex] = currentNode[i][arrayIndex] || {};
          currentNode = currentNode[i][arrayIndex];
        } else {
          currentNode[i].push({});
          currentNode = currentNode[i][currentNode[i].length - 1];
        }
      } else {
        currentNode = currentNode[i];
      }
    } else {
      currentNode = currentNode[i];
    }
  });

  if (Array.isArray(parentNode[currentKey])) {
    var arrayIndex = getArrayIndex(untouchedCurrentKey);

    if (arrayIndex) {
      parentNode[currentKey][arrayIndex] = value;
    } else {
      parentNode[currentKey].push(value);
    }
  } else {
    parentNode[currentKey] = value;
  }

  return payload;
};
