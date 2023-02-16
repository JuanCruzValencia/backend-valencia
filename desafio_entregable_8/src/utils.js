import { fileURLToPath } from "url";
import { dirname } from "path";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

export default __dirname;


//GENERAR FUNCION DE PASSPORTCALL PARA QUE SEA UN MIDDLEWARE QUE SIEMPRE SE VALIDE EN JWT
