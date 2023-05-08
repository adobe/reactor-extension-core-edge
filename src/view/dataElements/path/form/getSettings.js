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

const { getActionSourceId } = actionSources;

export default async ({ path, action, extension }) => {
  action = getActionSourceId(action);
  const extensions = await loadExtensions();

  const currentExtension = (extensions?.data || []).filter(
    (x) => x.attributes.display_name === extension
  )[0];

  // eslint-disable-next-line default-case
  switch (action) {
    case 'request':
      path = 'arc.request';
      break;
    case 'xdm':
      path = `arc.event.xdm${path ? `.${path}` : ''}`;
      break;
    case 'data':
      path = `arc.event.data${path ? `.${path}` : ''}`;
      break;
    case 'event':
      path = `arc.event${path ? `.${path}` : ''}`;
      break;
    case 'stash':
      path = `arc.ruleStash${
        currentExtension ? `.${currentExtension.attributes.name}` : ``
      }${path && currentExtension ? `.${path}` : ''}`;
  }

  const settings = { path };
  return settings;
};
