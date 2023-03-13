import { ERRORS_ENUM } from "../../consts/index.js";

export const errorHandler = (error, req, res, next) => {
  console.log(error.cause);

  const errorMessage = ERRORS_ENUM[error.name] || "Unhandled error";

  res.send({
    status: "error",
    error: errorMessage,
  });
};
