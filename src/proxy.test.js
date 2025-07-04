const {enableProxy } = require('./proxy')
const got = require('got');

describe('global-agent proxy support works as expected', () => {

  it('should fail with a request specific RequestError if got tries to request any-host without proxy', async () => {
    const expectedRequestErrorMessage = `getaddrinfo ENOTFOUND any-host`;
    try {
      await got.get('http://any-host')
      throw new Error('Test fail if the got request succeeds against expectation');
    } catch(e) {
      expect(e).toBeDefined();
      expect(e.message).toEqual(expectedRequestErrorMessage);
      expect(e.code).toEqual('ENOTFOUND');
    }
  });

  it('should fail with a proxy specific RequestError if got tries to request through the defined proxy', async () => {
    const PROXY_HOST = "my-test-proxy-server";
    process.env.GLOBAL_AGENT_HTTP_PROXY = `http://${PROXY_HOST}:8000`;
    enableProxy();
    const expectedRequestErrorMessage = `getaddrinfo ENOTFOUND ${PROXY_HOST}`;
    try {
      await got.get('http://any-host')
      throw new Error('Test fail if the got request succeeds against expectation');
    } catch(e) {
      expect(e).toBeDefined();
      expect(e.message).toEqual(expectedRequestErrorMessage);
      expect(e.code).toEqual('ENOTFOUND');
    }
  });

  it('should fail with a request specific RequestError if HTTP_PROXY URL is undefined', async () => {
    // set proxy url to undefined at runtime
    global.GLOBAL_AGENT.HTTP_PROXY = undefined;
    const expectedRequestErrorMessage = `getaddrinfo ENOTFOUND any-host`;
    try {
      await got.get('http://any-host')
      throw new Error('Test fail if the got request succeeds against expectation');
    } catch(e) {
      expect(e).toBeDefined();
      expect(e.message).toEqual(expectedRequestErrorMessage);
      expect(e.code).toEqual('ENOTFOUND');
    }
  });

  it('should fail with a request specific RequestError if HTTP_PROXY URL is empty', async () => {
    // set proxy url to empty string at runtime
    global.GLOBAL_AGENT.HTTP_PROXY = '';
    const expectedRequestErrorMessage = `getaddrinfo ENOTFOUND any-host`;
    try {
      await got.get('http://any-host')
      throw new Error('Test fail if the got request succeeds against expectation');
    } catch(e) {
      expect(e).toBeDefined();
      expect(e.message).toEqual(expectedRequestErrorMessage);
      expect(e.code).toEqual('ENOTFOUND');
    }
  });

  it('should fail with UNEXPECTED_STATE_ERROR if HTTP_PROXY URL protocol does not start with "http:"', async () => {
    // set proxy url to string with blanks at runtime
    global.GLOBAL_AGENT.HTTP_PROXY = 'file://';
    try {
      await got.get('http://any-host')
      throw new Error('Test fail if the got request succeeds against expectation');
    } catch(e) {
      expect(e).toBeDefined();
      expect(e.code).toEqual('UNEXPECTED_STATE_ERROR');
    }
  });
})