import { vi, describe, test, expect } from 'vitest';

vi.mock('@actions/core');

import core from '@actions/core';
import ServerMock from 'mock-http-server';
import { exportSecrets } from './action.js';
import { when } from 'jest-when';

describe('exportSecrets retries', () => {
    var server = new ServerMock({ host: "127.0.0.1", port: 0 });
    var calls = 0;

    beforeEach(() => new Promise(done => {
        calls = 0;
        vi.resetAllMocks();

        when(core.getInput)
            .calledWith('token', expect.anything())
            .mockReturnValueOnce('EXAMPLE');

        when(core.getInput)
            .calledWith('secrets', expect.anything())
            .mockReturnValueOnce("kv/mysecret key");

        server.start(() => {
            expect(server.getHttpPort()).not.toBeNull();
            when(core.getInput)
                .calledWith('url', expect.anything())
                .mockReturnValueOnce('http://127.0.0.1:' + server.getHttpPort());
            done();
        });
    }));

    afterEach(() => new Promise(done => {
        server.stop(done);
    }));

    function mockStatusCodes(statusCodes) {
        server.on({
            path: '/v1/kv/mysecret',
            reply: {
                status: function() {
                    let status = statusCodes[calls];
                    calls += 1;
                    return status;
                },
                headers: { "content-type": "application/json" },
                body: function() {
                    return JSON.stringify({ data: {"key": "value"} })
                }
            }
        });
    }

    it('retries on 412 status code', () => new Promise(done => {
        mockStatusCodes([412, 200])
        exportSecrets().then(() => {
            expect(calls).toEqual(2);
            done();
        });
    }));

    it('retries on 500 status code', () => new Promise(done => {
        mockStatusCodes([500, 200])
        exportSecrets().then(() => {
            expect(calls).toEqual(2);
            done();
        });
    }));
});
