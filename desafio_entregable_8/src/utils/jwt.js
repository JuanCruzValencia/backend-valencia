import jwt from "jsonwebtoken";

export const generateToken = (user) => {
  const token = jwt.sign({ user }, process.env.JWT_SECRET, {
    expiresIn: "24h",
  });

  return token;
};

export const authToekn = (req, res, next) => {
  const authCookie = req.cookies.process.env.COOKIE;

  if (!authCookie) {
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

import dotenv from "dotenv";
dotenv.config();

export const cookieExtractor = (req) => {
  const token =
    req && req.cookies ? req.cookies[process.env.COOKIE_TOKEN] : null;

  return token;
};
