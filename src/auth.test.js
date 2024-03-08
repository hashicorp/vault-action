import { vi, describe, test, expect } from 'vitest';

vi.mock('got');
vi.mock('@actions/core');
vi.mock('@actions/core/lib/command');
vi.mock('fs', () => ({
    stat: vi.fn().mockResolvedValue(null),
    promises: {
        access: vi.fn().mockResolvedValue(null),
    }
}));

import * as core from '@actions/core';
import * as got from 'got'
import * as fs from 'fs';
import { when } from 'jest-when'

import { retrieveToken } from './auth.js';


function mockInput(name, key) {
    when(core.getInput)
        .calledWith(name, expect.anything())
        .mockReturnValueOnce(key);
}

function mockApiResponse() {
    const response = { body: { auth: { client_token: testToken, renewable: true, policies: [], accessor: "accessor" } } }
    got.post = vi.fn()
    got.post.mockReturnValue(response)
}
const testToken = "testoken";

describe("test retrival for token", () => {

    beforeEach(() => {
        vi.resetAllMocks();
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
        fs.readFileSync = vi.fn()
        fs.readFileSync.mockReturnValueOnce(jwtToken)
        const token = await retrieveToken(method, got)
        expect(token).toEqual(testToken)
        const payload = got.post.mock.calls[0][1].json
        expect(payload).toEqual({ jwt: jwtToken, role: testRole })
        const url = got.post.mock.calls[0][0]
        expect(url).toContain('differentK8sPath')
    })
})
