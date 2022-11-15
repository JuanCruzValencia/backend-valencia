// Primer desafio entregable

// Creacion de clase Product Manager
class ProductManager {
  // Variable privada productos
  #products;

  constructor() {
    this.#products = [];
  }
  // funcion para devolver los productos que se encuentran guardados
  // no recibe paramentros
  // devuelve el array de prodcutos
  getProducts = () => {
    return this.#products;
  };

  // funcion que genera el id automatico de los productos
  // no recibe parametros
  // devuelve un id generado a travez del largo del array de productos
  createProductId = () => {
    const index = this.#products.length;
    const id = index > 0 ? index + 1 : 1;
    return id;
  };

  // funcion que busca coindidencia entre el codigo ingresado y los guardados en la bd
  // recibe como paramtro el codigo del nuevo producto
  // devuelve verdadero si lo encuentra sino falso
  searchProdcutCode = (productCode) => {
    const productsCopy = [...this.#products];
    const productSearched = productsCopy.some(
      (product) => product.code === productCode
    );
    return productSearched;
  };

  // funcion para validar las valriables ingresadas cuando se agregan productos
  // recibe por parametro todas la viarables del objeto nuevo producto
  // devuelve verdadero si cumple con las validaciones sino falso
  validateInputs = ({ title, description, price, thumnail, code, stock }) => {
    return (
      title.trim().length > 0 &&
      description.trim().length > 0 &&
      thumnail.trim().length > 0 &&
      code.trim().length > 0 &&
      price.toString().trim().length > 0 &&
      stock.toString().trim().length > 0
    );
  };

  // funcion que busca coincidencia entre el id igresado y
  // los productos guardados en el array de productos
  // recibe por parametro un id
  // si hay coincidencia devuelve el producto, sino que no existe
  getProductById = (productId) => {
    const productsCopy = [...this.#products];
    const productSearched = productsCopy.find(
      (product) => product.id === productId
    );
    productSearched
      ? console.log(productSearched)
      : console.error(`Product: ${productId} NOT FOUND`);
  };

  // funcion para agregar nuevos productos
  // recibe por parametro todas las variables requeridas para crear el objeto producto
  // crea y guarda el objeto en el array de productos
  addProduct = (title, description, price, thumnail, code, stock) => {
    const newProduct = {
      id: this.createProductId(),
      title,
      description,
      price,
      thumnail,
      code,
      stock,
    };
    if (this.searchProdcutCode(newProduct.code)) {
      console.error(`Product ${newProduct.code} is already in the DB`);
      return;
    }
    if (!this.validateInputs({ ...newProduct })) {
      console.error("Fill all the inputs to continue");
    } else {
      this.#products.push(newProduct);
      console.log(
        `Product: ${newProduct.title} has succesfully been added to the DB`
      );
    }
  };
}

// TEST por consola

const valencia = new ProductManager();

console.log("Productos en la base de datos:", valencia.getProducts());
console.log("---- inicio del test ----");
console.log("-------------------------");
console.log("-------------------------");
valencia.addProduct(
  "producto de prueba",
  "Este es un producto de prueba",
  200,
  "Sin imagen",
  "abc123",
  25
);
console.log("Productos en la base de datos:", valencia.getProducts());
console.log("-------------------------");
console.log("-------------------------");
console.log("-------------------------");
valencia.addProduct("producto de prueba", "", 200, "Sin imagen", "abc123", 25);
console.log("Productos en la base de datos:", valencia.getProducts());
console.log("-------------------------");
console.log("-------------------------");
console.log("-------------------------");
valencia.getProductById(45);
valencia.getProductById(1)
console.log("----- fin del test -----");