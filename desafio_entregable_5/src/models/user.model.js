import moongose from "moongose";

const userCollections = "students";

const userSchema = new moongose.Schema({
  name: String,
  lastname: String,
  age: Number,
  dni: String,
  course: String,
  note: Number,
});

export const userModel = moongose.model(userCollections, userSchema);
