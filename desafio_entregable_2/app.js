// guardo en una variable el modulo file system
const fs = require("fs");

// Uso de estructura el desafio anterior
class ProductManager {
  constructor(path) {
    this.path = path;
  }

  // Modificaciones en para obtener el id del producto
  // la consulta ahora es leyendo la DB y devuelve el largo del array + 1
  getProductId = async () => {
    const productsCopy = await fs.promises.readFile(this.path, "utf-8");
    const productsCopyObj = JSON.parse(productsCopy);
    const index = productsCopyObj.length;
    const id = index === undefined ? index + 1 : 1;
    return id;
  };

  // La forma de validar los inputs se mantiene de manera sincronica
  validateInputs = ({ title, description, price, thumbnail, code, stock }) => {
    return (
      title.trim().length > 0 &&
      description.trim().length > 0 &&
      thumbnail.trim().length > 0 &&
      code.trim().length > 0 &&
      price.toString().trim().length > 0 &&
      stock.toString().trim().length > 0 &&
      price > 0 &&
      stock > 0
    );
  };

  // Modificaciones en la verificacion del code
  // Se consulta primero la DB y luego se hace la comparacion usando metodo some
  verifyCode = async (productCode) => {
    const productsCopy = await fs.promises.readFile(this.path, "utf-8");
    const productsCopyObj = JSON.parse(productsCopy);
    const isInDb = productsCopyObj.some(
      (product) => product.code === productCode
    );
    return isInDb;
  };

  // La funcion para agregar productos funciona de manera asincrona
  // despues de crear el objeto, verificar que los campos esten completos
  // y que el code no se repita con otro productos
  // escribimos la DB usando fs.promise
  addProduct = async (title, description, price, thumbnail, code, stock) => {
    const id = await this.getProductId().then((id) => id);
    const newProduct = {
      id,
      title,
      description,
      price,
      thumbnail,
      code,
      stock,
    };
    // verifica los campos de manera sincronica
    if (!this.validateInputs({ ...newProduct })) {
      console.log("Please fill all the inputs");
    }
    // verifica el codigo de manera asincronica
    const codeIsVerify = await this.verifyCode(newProduct.code);
    if (codeIsVerify) {
      console.log("This product code already exist is the data base");
    }
    // creo el archivo donde voy a guardar los datos de mi array de productos
    await fs.promises.writeFile(this.path, JSON.stringify([newProduct]));
    console.log("TEST: PRODUCTO AGREGDO CON EXITO");
  };

  // La funcion para leer la DB tiene dos partes
  // Trata de leer la DB y si puede devuelve el array de productos
  // Si la Db esta completamente vacia primero la escribe con el array vacio
  // y despues devuelve ese array, sino el el metodo JSON.parse devuelve un error
  // Ya que trata de convertir a string una resolucion undefined
  getProducts = async () => {
    if (fs.existsSync(this.path)) {
      const resolve = await fs.promises.readFile(this.path, "utf-8");
      const products = JSON.parse(resolve);
      return products;
    } else {
      return [];
    }
  };

  // funcion para obtener los productos por el id, previamente me tengo que traer
  // los datos escritos en mi archivo DB.json
  getProductById = async (productId) => {
    const productsCopy = await fs.promises.readFile(this.path, "utf-8");
    const productsCopyObj = JSON.parse(productsCopy);
    const searchedProduct = productsCopyObj.find(
      (product) => product.id === productId
    );
    return searchedProduct !== undefined
      ? searchedProduct
      : console.log("NOT FOUND");
  };

  // funcion para actualizar productos de mi archivo (NUEVA)
  // recibe como parametros un id y un objeto
  // primero lee el archivo DB.json y guardamos en una variable la resolucion
  // con el metodo find buscamos el objeto dentro del array
  // con el metodo filter buscamos separar el resto de los productos del selecionado
  // creamos un nuevo objeto utilizando el metodo rest (...) con el id original y los campos modificados
  // es valido este metodo siempre que a pesar de solo cambiar un campo se nos de el objeto completo
  // agregamos el objeto modificado al array filtrado
  // escribimos la DB con mi array actuaizado
  updateProduct = async (productId, objUpdated) => {
    const productsCopy = await fs.promises.readFile(this.path, "utf-8");
    const productsCopyObj = JSON.parse(productsCopy);
    const productToUpdate = productsCopyObj.find(
      (product) => product.id === productId
    );
    const filteredProducts = productsCopyObj.filter(
      (product) => product.id !== productId
    );
    const prodcutUpdated = { id: productToUpdate.id, ...objUpdated };
    filteredProducts.push(prodcutUpdated);
    await fs.promises.writeFile(this.path, JSON.stringify(filteredProducts));
    console.log(filteredProducts);
  };

  // funcion para eliminar prodcutos de mi archivo
  // similar a la funcion sincrona pero ahora obtenemos el array leyendo la DB
  deleteProduct = async (productId) => {
    const productsCopy = await fs.promises.readFile(this.path, "utf-8");
    const productsCopyObj = JSON.parse(productsCopy);
    const filteredProducts = productsCopyObj.filter(
      (product) => product.id !== productId
    );
    await fs.promises.writeFile(this.path, JSON.stringify(filteredProducts));
  };
}

// TESTS

// A - Creando una instancia de la clase Product Manager

const valencia = new ProductManager("./data/DB.json");

// B - Se invoca a getProducts() devuelve productos | error y mensaje

//console.log(await valencia.getProducts())

// C - Se agrega un nuevo producto

// valencia.addProduct(
//   "Producto de prueba",
//   "Este es un producto de prueba",
//   250,
//   "No hay imagen",
//   "abc123",
//   50
// );

// D - Se invoca a getProducts() nuevamente con el prodcuto ya ingresado en el array

//console.log(await valencia.getProducts())

// E - Se invoca a la funcion getProductById para verificar que exista en al DB

//console.log(await valencia.getProductById(1))

// F - Se invoca a la funcion updateProduct con objeto completo y las modificaciones
// este test devuelve el objeto por consola para verificar los cambios

// const newObj = {
//   title: "Producto de prueba actualizado",
//   description: "Este es el producto actualizado",
//   price: 250,
//   thumbnail: "No hay imagen",
//   code: "abc123",
//   stock: 50,
// };
// valencia.updateProduct(1, newObj);

// G - Se invoca a la funcion deleteProduct con el id del objeto a eliminar

// valencia.deleteProduct(1);

// H - Verifico que el producto haya sido elimninado y me devuelva un array vacio

//console.log(await valencia.getProducts())
