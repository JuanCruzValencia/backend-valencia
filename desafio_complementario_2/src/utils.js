import { pathToFileURL } from "url";
import { dirname } from "path";

const __filename = pathToFileURL(import.meta.url);
const __dirname = dirname(__filename);

export default __dirname;
