jest.mock('got');
jest.mock('@actions/core');

const core = require('@actions/core');
const got = require('got');
const { when } = require('jest-when');

const {
    revokeClientToken
} = require('./revoke');

function mockApiResponse() {
    const response = ""
    got.post = jest.fn()
    got.post.mockReturnValue(response)
}
function mockApiFailure() {
    const response = { "errors": ["permission denied"] }
    got.post = jest.fn()
    got.post.mockReturnValue(response)
}
describe("test revoke for token", () => {
    beforeEach(() => {
        jest.resetAllMocks();
    });

    it("test revoke with success", async () => {
        mockApiResponse()
        await revokeClientToken(got)
        console.log(got.post.mock.calls[0][1])
    })

    it("test revoke with error", async () => {
        mockApiFailure()
        await revokeClientToken(got)
        console.log(got.post.mock.calls[0][1])
    })
})
