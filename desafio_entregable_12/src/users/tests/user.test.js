import supertest from "supertest";
import chai from "chai";
import dotenv from "dotenv";
import { newFakerUser } from "../../utils/users.mock.js";
dotenv.config();

const expect = chai.expect;
const requester = supertest(process.env.BASE_URL);

describe("Testing auth and user endpoints", () => {
  describe("POST /register should register a new user", () => {
    const newUser = newFakerUser();
    const incompleteNewUser = {
      email: "juan@Mail.com",
      password: "secret123",
    };
    let userEmail, password;

    it("POST/regiser should return status 200 and _id property if new user was registed successfully", async () => {
      const { _body, status } = await requester.post("/register").send(newUser);

      const user = _body.payload;

      userEmail = user.email;
      password = user.password;

      expect(status).to.exist.and.to.be.equal(200);
      expect(_body.payload).to.have.deep.property("_id");
    });

    it("POST/register should return status 400 if any of the new user inputs were undefined", async () => {
      const { status } = await requester
        .post("/register")
        .send(incompleteNewUser);

      expect(status).to.exist.and.to.be.equal(400);
    });
  });

  describe("POST /login should log registered user", () => {
    const userAccount = {
      email: "jcvalencia@ismt.edu.ar",
      password: "qweqwe",
    };
    const incompleteUser = {
      email: "juan@Mail.com",
      password: "secret123",
    };
    it("POST/login should return status 200 if mail and password was correct", async () => {
      const { status } = requester.post("/login").send(userAccount);

      expect(status).to.exist.and.to.be.equal(200);
    });

    it("POST/login should return cookie with jwt token", async () => {
      const response = (await requester.post("/login")).send(userAccount);

      const cookie = response.header["set-cookie"][0];

      expect(cookie).to.exist;
    });

    it("POST/register should return status 400 if any of the new user inputs were incomplete or wrong", async () => {
      const { status } = await requester.post("/register").send(incompleteUser);

      expect(status).to.exist.and.to.be.equal(400);
    });
  });
});
