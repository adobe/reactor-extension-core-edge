/*
Copyright 2022 Adobe. All rights reserved.
This file is licensed to you under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License. You may obtain a copy
of the License at http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software distributed under
the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR REPRESENTATIONS
OF ANY KIND, either express or implied. See the License for the specific language
governing permissions and limitations under the License.
*/

const actionSources = [
  {
    id: 'event',
    name: 'Read data from the event (arc.event)'
  },
  {
    id: 'xdm',
    name: 'Read data from XDM (arc.event.xdm)'
  },
  {
    id: 'data',
    name: 'Read data from the custom data layer (arc.event.data)'
  },
  {
    id: 'stash',
    name: 'Read data from the rule stash (arc.ruleStash)'
  },
  {
    id: 'custom',
    name: 'Read data from the provided path'
  },
  {
    id: 'request',
    name: 'Read the request (arc.request)'
  }
];

const actionSourcesIdsMap = actionSources.reduce(
  (previousValue, currentValue) => {
    previousValue[currentValue.id] = currentValue.name;
    return previousValue;
  },
  {}
);

const actionSourcesNamesMap = actionSources.reduce(
  (previousValue, currentValue) => {
    previousValue[currentValue.name] = currentValue.id;
    return previousValue;
  },
  {}
);

export default {
  getActionSourceId: (name) => actionSourcesNamesMap[name] || name,
  getActionSourceName: (id) => actionSourcesIdsMap[id] || id,
  getActionSourceNames: () => actionSources.map((action) => action.name)
};
