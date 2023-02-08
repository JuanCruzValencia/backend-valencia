// GENERAR LOGICA PARA TRABAJAR CON PASSPORT JWT, LOCAL Y GITHUB
import passport from "passport";
import passportJwt from "passport-jwt";
import passportLocal from "passport-local";
import { authToekn, generateToken, cookieExtractor } from "../utils/jwt.js";
import dotenv from "dotenv";
dotenv.config();

const JwtStrategy = passportJwt.Strategy;
const JwtExtractor = passportJwt.ExtractJwt;
const LocalStrategy = passportLocal.Strategy;

const initializePassport = () => {
  passport.use(
    "register",
    new LocalStrategy(
      {
        passReqToCallback: true,
        usernameField: "email",
      },
      async (req, username, password, done) => {
        try {
        } catch (error) {
          console.log(error);

          return done(error);
        }
      }
    )
  );

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

  passport.serializeUser((user, done) => {
    done(null, user._id);
  });

  passport.deserializeUser(async (id, done) => {
    const user = await UserModel.findById(id);

    done(null, user);
  });
};

export default initializePassport;
