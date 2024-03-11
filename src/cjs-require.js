// This allows us to use `require` in our ECMAScript module
// https://nodejs.org/api/module.html#modulecreaterequirefilename
import { createRequire } from "module";
const require = createRequire(import.meta.url);

export default require;
