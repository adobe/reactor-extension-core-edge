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

import actionSources from '../helpers/actionSources';
import loadExtensions from '../api/loadExtensions';

const { getActionSourceName } = actionSources;

export default async ({ settings }) => {
  let extensions = [];

  try {
    extensions = await loadExtensions();
    extensions = extensions.data;
  } catch (e) {
    // Don't do anything.
  }

  let path = settings?.path || '';
  let action = '';
  let extension = '';
  if (path.startsWith('arc.event.xdm')) {
    action = 'xdm';
    path = path.replace(/^arc\.event\.xdm\.?/, '');
  } else if (path.startsWith('arc.ruleStash')) {
    action = 'stash';
    path = path.replace(/^arc\.ruleStash\./, '');
    path = path.split('.');
    const extensionName = path.shift();
    const currentExtension = extensions.filter(
      (x) => x.attributes.name === extensionName
    )[0];
    extension = currentExtension?.attributes.display_name || '';
    if (extension) {
      path = path.join('.');
    } else {
      path = '';
    }
  } else if (path.startsWith('arc.event.data')) {
    action = 'data';
    path = path.replace(/^arc\.event\.data\.?/, '');
  } else if (path === 'arc.request') {
    action = 'request';
    path = '';
  } else if (path.startsWith('arc.event')) {
    action = 'event';
    path = path.replace(/^arc\.event\.?/, '');
  } else if (path) {
    action = 'custom';
  }

  return {
    action: getActionSourceName(action),
    extension,
    path
  };
};
