/**
 * Copyright IBM Corp. 2019, 2026
 * SPDX-License-Identifier: MIT
 */

const core = require('@actions/core');
const { exportSecrets } = require('./action');

(async () => {
    try {
        await core.group('Get Vault Secrets', exportSecrets);
    } catch (error) {
        core.setOutput("errorMessage", error.message);
        core.setFailed(error.message);
    }
})();
