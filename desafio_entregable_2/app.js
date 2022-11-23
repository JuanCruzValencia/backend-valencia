// guardo en una variable el modulo file system
const fs = require("fs");

// Uso de estructura el desafio anterior
class ProductManager {
  constructor() {
    this.path = "./data/DB.json";
  }

  getProductId = async () => {
    const productsCopy = await fs.promises.readFile(this.path, "utf-8");
    const productsCopyObj = JSON.parse(productsCopy);
    const index = productsCopyObj.length;
    const id = index === undefined ? index + 1 : 1;
    return id;
  };

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

  verifyCode = async (productCode) => {
    const productsCopy = await fs.promises.readFile(this.path, "utf-8");
    const productsCopyObj = JSON.parse(productsCopy);
    const isInDb = productsCopyObj.some(
      (product) => product.code === productCode
    );
    return isInDb;
  };

  addProduct = async (title, description, price, thumbnail, code, stock) => {
    const id = this.getProductId().then((id) => id);
    console.log(id);
    const newProduct = {
      id,
      title,
      description,
      price,
      thumbnail,
      code,
      stock,
    };

    if (!this.validateInputs({ ...newProduct }))
      console.log("Please fill all the inputs");
    if (this.verifyCode(newProduct.code))
      console.log("This product code already exist is the data base");

    // creo el archivo donde voy a guardar los datos de mi array de productos
    await fs.promises.writeFile(this.path, JSON.stringify([newProduct]));
    console.log("TEST: PRODUCTO AGREGDO CON EXITO");
  };

  // funcion asincrona que va a leer el archivos con mis productos
  getProducts = async () => {
    //leer la base de datos de prodcutos
    try {
      const resolve = await fs.promises.readFile(this.path, "utf-8");
      if (resolve.length === 0) throw new Error();
      return resolve;
    } catch (error) {
      console.log("Array vacio");
    }
  };

  // funcion para obtener los productos por el id, previamente me tengo que traer
  // los datos gurdados en mi archivo
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

  // funcion para actualizar productos de mi archivo
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
const valencia = new ProductManager();

// B - Se invoca a getProducts() devuelve productos | error y mensaje
// valencia.getProducts().then((products) => {
//   if (products !== undefined) {
//     const result = JSON.parse(products);
//     console.log(result);
//   }
// });

// C - Se agrega un nuevo producto

valencia.addProduct(
  "Producto de prueba",
  "Este es un producto de prueba",
  250,
  "No hay imagen",
  "abc123",
  50
);

// D - Se invoca a getProducts() nuevamente con el prodcuto ya ingresado en el array
// valencia.getProducts().then((products) => {
//   const result = JSON.parse(products);
//   console.log(result);
// });

// E - Se invoca a la funcion getProductById para verificar que exista en al DB
// valencia.getProductById(1).then((product) => {
//   console.log(product);
// });

// F - Se invoca a la funcion updateProduct con objeto completo y las modificaciones
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
