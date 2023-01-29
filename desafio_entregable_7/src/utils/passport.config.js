import passport from "passport";
import local from "passport-local";
import GitHubStrategy from "passport-github2";
import Managers from "../dao/managers/index.js";
import dotenv from "dotenv";

dotenv.config();
const UserManager = Managers.UsersManager;
const LocalStrategy = local.Strategy;
//const GitHubStrategy = github.Strategy;

const initializePassporr = () => {
  //passport github
  passport.use(
    "github",
    new GitHubStrategy(
      {
        clientID: process.env.CLIENT_ID,
        clientSecret: process.env.CLIENT_SECRET,
        callbackURL: process.env.CB_URL,
      },
      async (accessToken, refreshToken, profile, done) => {
        try {
          const newUser = {
            first_name: profile._json.name,
            last_name: "",
            email: profile._json.email,
            password: "",
          };

          const result = await UserManager.userCreate(newUser);

          return done(null, result);
        } catch (error) {
          return done("Error to register", error);
        }
      }
    )
  );

  // passport local
  passport.use(
    "register",
    new LocalStrategy(
      {
        passReqToCallback: true,
        usernameField: "email",
      },
      async (req, username, password, done) => {
        try {
          const { first_name, last_name, email, age } = req.body;

          const findUser = await UserManager.getUserByEmail({
            email: username,
          });

          if (findUser) {
            return done(null, false);
          }

          const newUser = {
            first_name,
            last_name,
            email,
            age,
            password,
          };

          const user = await UserManager.userCreate(newUser);

          if (!user) {
            return done(null, false);
          }

          return done(null, user);
        } catch (error) {
          return done("Error to register" + error);
        }
      }
    )
  );

  passport.use(
    "login",
    new LocalStrategy(
      {
        usernameField: "email",
      },
      async (username, password, done) => {
        try {
          const result = await UserManager.userLogin(username, password);

          return done(null, result);
        } catch (error) {
          return done(error);
        }
      }
    )
  );

  passport.serializeUser((user, done) => {
    done(null, user._id);
  });

  passport.deserializeUser(async (id, done) => {
    const user = UserManager.getUserById(id);

    done(null, user);
  });
};

export default initializePassporr;
