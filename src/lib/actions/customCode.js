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

/**
 * Custom code action. This executes action code provided by the user.
 * @param {Object} context Action settings.
 * @param {Object} context.arc Adobe Request Context. It contains data like: event, request,
 *                     and ruleStash.
 * @param {Object} context.utils It contains utilities like logger, fetch, getSettings.
 * @returns {Promise}
 */
module.exports = ({ arc, utils }) => {
  const ruleStash = arc.ruleStash || {};
  const coreRuleStash = ruleStash.core || {};
  coreRuleStash.customCode = coreRuleStash.customCode || {};

  const settings = utils.getSettings();

  return Promise.resolve(settings.source(arc, utils)).then((r) => {
    coreRuleStash.customCode[settings.keyName] = r;
    return coreRuleStash;
  });
};
