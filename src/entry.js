const core = require('@actions/core');
const { exportSecrets } = require('./action');

(async () => {
    try {
        await core.group('MCOULOMBE TEST', exportSecrets);
    } catch (error) {
        core.setFailed(error.message);
    }
})();
