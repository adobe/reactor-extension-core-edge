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

import getEnvironment from '../getEnvironment';

describe('getEnvironment function', () => {
  test('returns staging for a staging token', () => {
    const stagingToken =
      'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpc3MiOiJPbmxpbmUgSldUIEJ1a' +
      'WxkZXIiLCJpYXQiOjE2MjMyNzcwNzksImV4cCI6MTY1NDgxMzA3OSwiYXVkIjoid3d' +
      '3LmV4YW1wbGUuY29tIiwic3ViIjoidGVzdEBleGFtcGxlLmNvbSIsImFzIjoiaW1zL' +
      'W5hMS1zdGcxIn0.JoCX1DIazWBZrYAL4BPIXZnLxfHWcQRbTDwCowygAtw';

    expect(getEnvironment(stagingToken)).toBe('staging');
  });

  test('returns production for a production token', () => {
    const productionToken =
      'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpc3MiOiJPbmxpbmUgSldUIEJ1a' +
      'WxkZXIiLCJpYXQiOjE2MjMyNzcwNzksImV4cCI6MTY1NDgxMzA3OSwiYXVkIjoid3d' +
      '3LmV4YW1wbGUuY29tIiwic3ViIjoidGVzdEBleGFtcGxlLmNvbSIsImFzIjoiaW1zL' +
      'W5hMSJ9.5M4qNwRDUKiXvfD1--fhoEVrftVd5CdYQhGqH1XVzyw';

    expect(getEnvironment(productionToken)).toBe('production');
  });

  test('returns staging if a token without 3 parts is provided', () => {
    const token = 'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9';
    expect(getEnvironment(token)).toBe('staging');
  });

  test('returns staging if a token with an invalid middle part is provided', () => {
    const token =
      'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpc3MiOiJPbmxpbmUgSldUIEJ1a' +
      'WxkZXIiLCJpYXQiOjE2MjMyNzcwNzksImV4cCI6MTY1NDgxMzA3OSwiYXVkIjoid3d' +
      '3LmV4YW1wbGUuY29tIiwic3ViIjoidGVzdEBleGFtcGxlLmNvbSIsImFzIjoiaW1zL' +
      'W5hMS1zdG.JoCX1DIazWBZrYAL4BPIXZnLxfHWcQRbTDwCowygAtw';

    expect(getEnvironment(token)).toBe('staging');
  });
});
