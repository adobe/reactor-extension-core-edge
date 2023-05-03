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

module.exports = {
  event: {
    xdm: {
      web: {
        webPageDetails: { URL: 'http://localhost:3000/' },
        webReferrer: { URL: '' }
      },
      device: {
        screenHeight: 1,
        screenWidth: 1680,
        screenOrientation: 'landscape'
      },
      environment: {
        type: 'browser',
        browserDetails: { viewportWidth: 1200, viewportHeight: 431 },
        connectionType: '4g'
      },
      placeContext: {
        localTime: '2019-10-01T12:03:49.143-06:00',
        localTimezoneOffset: 360
      },
      timestamp: '2019-10-01T18:03:49.143Z',
      _myorg: { type: {}, url: 'http://localhost:3000/', name: 'home' }
    },
    meta: {
      personalization: { sessionId: '55178f32-d44c-4839-8d94-5ed7a6abe2a6' }
    },
    data: { nonXdmKey: 'nonXdmValue', name: 'home' }
  }
};
