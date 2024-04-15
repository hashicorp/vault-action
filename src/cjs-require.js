// This allows us to use `require` in our ECMAScript module
// See: https://github.com/vercel/ncc/issues/791
import { createRequire } from 'node:module';
import url from 'node:url';

const __filename = url.fileURLToPath(import.meta.url);
globalThis.require = createRequire(__filename);

export default require;
