export default class CustomError {
  static createError({ name = "Error", message }) {
    const error = new Error();
    error.name = name;
    // error.message = message;
    throw error;
  }
}
