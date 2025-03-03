const { normalizeOutputKey } = require('./utils');
const core = require('@actions/core');

/** A map of postfix values mapped to the key in the certificate response and a transformer function */
const outputMap = {
    cert: { key: 'certificate', tx: (v) => v },
    key: { key: 'private_key', tx: (v) => v },
    ca: { key: 'issuing_ca', tx: (v) => v },
    ca_chain: { key: 'ca_chain', tx: (v) => v.join('\n') },
};

/**
 * @typedef PkiRequest
 * @type {object}
 * @property {string} path - The path to the PKI endpoint
 * @property {Record<string, any>} parameters - The parameters to send to the PKI endpoint
 * @property {string} envVarName - The name of the environment variable to set
 * @property {string} outputVarName - The name of the output variable to set
 */

/**
 * @typedef {Object} PkiResponse
 * @property {PkiRequest} request
 * @property {string} value
 * @property {boolean} cachedResponse
 */

/**
 * Generate and return the certificates from the PKI engine
 * @param {Array<PkiRequest>} pkiRequests
 * @param {import('got').Got} client
 * @return {Promise<Array<PkiResponse>>}
 */
async function getCertificates(pkiRequests, client) {
    /** @type Array<PkiResponse> */
    let results = [];

    for (const pkiRequest of pkiRequests) {
        const { path, parameters } = pkiRequest;

        const requestPath = `v1/${path}`;
        let body;
        try {
            const result = await client.post(requestPath, {
                body: JSON.stringify(parameters),
            });
            body = result.body;
        } catch (error) {
            core.error(`✘ ${error.response?.body ?? error.message}`);
            throw error;
        }

        body = JSON.parse(body);

        core.info(`✔ Successfully generated certificate (serial number ${body.data.serial_number})`);

        Object.entries(outputMap).forEach(([key, value]) => {
            const val = value.tx(body.data[value.key]);
            results.push({
                request: {
                    ...pkiRequest,
                    envVarName: normalizeOutputKey(`${pkiRequest.envVarName}_${key}`, true),
                    outputVarName: normalizeOutputKey(`${pkiRequest.outputVarName}_${key}`),
                },
                value: val,
                cachedResponse: false,
            });
        });
    }

    return results;
}

module.exports = {
    getCertificates,
};