import jwt from "jsonwebtoken";

export const generateToken = (user) => {
  const token = jwt.sign({ user }, process.env.JWT_SECRET, {
    expiresIn: "24h",
  });

  return token;
};

export const authToekn = (req, res, next) => {
  const authHeader = req.headers.auth;

  if (!authHeader) {
    return res.status(401).send({
      error: "Not Auth",
    });
  }

  const token = authHeader.split(" ")[1];

  jwt.verify(token, process.env.JWT_SECRET, (error, credentials) => {
    if (error) {
      return res.status(403).send({
        error: "Not Authorized",
      });
    }

    req.user = credentials.user;

    next();
  });
};
