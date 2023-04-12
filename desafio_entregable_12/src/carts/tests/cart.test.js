import supertest from "supertest";
import chai from "chai";
import dotenv from "dotenv";
dotenv.config();

const expect = chai.expect;
const requestes = supertest(process.env.BASE_URL);
