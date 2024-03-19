// This allows us to use `require` in our ECMAScript module
// See: https://github.com/vercel/ncc/issues/791
// https://nodejs.org/api/module.html#modulecreaterequirefilename
import { createRequire } from "module";
const require = createRequire(import.meta.url);

export default require;
