const core = require('@actions/core');
const { revokeToken } = require('./action');

(async () => {
    try {
        await revokeToken()
    } catch (error) {
        core.setOutput("errorMessage", error.message);
        core.setFailed(error.message);
    }
})();
