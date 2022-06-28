jest.mock('got');
jest.mock('@actions/core');
jest.mock('@actions/core/lib/command');
jest.mock('fs', () => ({
    stat: jest.fn().mockResolvedValue(null),
    promises: {
        access: jest.fn().mockResolvedValue(null),
    }
}));

const core = require('@actions/core');
const got = require('got');
const fs = require("fs")
const { when } = require('jest-when');


const {
    retrieveToken
} = require('./auth');


function mockInput(name, key) {
    when(core.getInput)
        .calledWith(name, expect.anything())
        .mockReturnValueOnce(key);
}

function mockApiResponse() {
    const response = { body: { auth: { client_token: testToken, renewable: true, policies: [], accessor: "accessor" } } }
    got.post = jest.fn()
    got.post.mockReturnValue(response)
}
const testToken = "testoken";

describe("test retrival for token", () => {

    beforeEach(() => {
        jest.resetAllMocks();
    });

    it("test retrival with approle", async () => {
        const method = 'approle'
        mockApiResponse()
        const testRoleId = "testRoleId"
        const testSecretId = "testSecretId"
        mockInput("roleId", testRoleId)
        mockInput("secretId", testSecretId)
        const token = await retrieveToken(method, got)
        expect(token).toEqual(testToken)
        const payload = got.post.mock.calls[0][1].json
        expect(payload).toEqual({ role_id: testRoleId, secret_id: testSecretId })
        const url = got.post.mock.calls[0][0]
        expect(url).toContain('approle')
    })

    it("test retrival with github token", async () => {
        const method = 'github'
        mockApiResponse()
        const githubToken = "githubtoken"
        mockInput("githubToken", githubToken)
        const token = await retrieveToken(method, got)
        expect(token).toEqual(testToken)
        const payload = got.post.mock.calls[0][1].json
        expect(payload).toEqual({ token: githubToken })
        const url = got.post.mock.calls[0][0]
        expect(url).toContain('github')
    })

    it("test retrival with kubernetes", async () => {
        const method = 'kubernetes'
        const jwtToken = "someJwtToken"
        const testRole = "testRole"
        const testTokenPath = "testTokenPath"
        const testPath = 'differentK8sPath'
        mockApiResponse()
        mockInput("kubernetesTokenPath", testTokenPath)
        mockInput("role", testRole)
        mockInput("path", testPath)
        fs.readFileSync = jest.fn()
        fs.readFileSync.mockReturnValueOnce(jwtToken)
        const token = await retrieveToken(method, got)
        expect(token).toEqual(testToken)
        const payload = got.post.mock.calls[0][1].json
        expect(payload).toEqual({ jwt: jwtToken, role: testRole })
        const url = got.post.mock.calls[0][0]
        expect(url).toContain('differentK8sPath')
    })
})
