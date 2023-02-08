// GENERAR LOGICA PARA TRABAJAR CON PASSPORT JWT, LOCAL Y GITHUB
import passport from "passport";
import passportJwt from "passport-jwt";
import { authToekn, generateToken, cookieExtractor } from "../utils/jwt.js";
import dotenv from "dotenv";
dotenv.config();

const JwtStrategy = passportJwt.Strategy;
const JwtExtractor = passportJwt.ExtractJwt;

const initializePassport = () => {
  passport.use(
    "jwt",
    new JwtStrategy(
      {
        jwtFromRequest: JwtExtractor.fromExtractors([cookieExtractor]),
        secretOrKey: process.env.JWT_SECRET,
      },
      async (jwt_payload, done) => {
        try {
          return done(null, jwt_payload);
        } catch (error) {
          console.log(error);

          return done(error);
        }
      }
    )
  );
};

export default initializePassport;
