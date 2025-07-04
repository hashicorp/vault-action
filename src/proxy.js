const {bootstrap} = require('global-agent');
const core = require("@actions/core");
const MAJOR_NODEJS_VERSION = parseInt(process.version.slice(1).split('.')[0], 10);

/**
 * Will enable global-agent proxy if the necessary
 * [global-agent environment variables](https://github.com/gajus/global-agent?tab=readme-ov-file#environment-variables)
 * has been set.
 * The global-agent bootstrap routine guards against multiple initializations of global-agent
 * Important note: `global-agent` only works with Node.js v10 and above.
 */
function enableProxy() {
  if (MAJOR_NODEJS_VERSION >= 10) {
    bootstrap();
  } else {
    core.debug('proxy configuration does not work with Node.js below v10')
  }
}

module.exports = {
  enableProxy
}