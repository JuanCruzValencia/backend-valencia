import supertest from "supertest";
import chai from "chai";
import dotenv from "dotenv";
dotenv.config();

const expect = chai.expect;
const requester = supertest(process.env.BASE_URL);

describe("Testing products endpoint", () => {
  describe("/api/products", () => {
    it("Get should return an status 200", async () => {
      const { status } = await requester.get("/api/products");

      expect(status).to.exist.and.to.be.equal(200);
    });

    it("Get should return an array", async () => {
      const { _body } = await requester.get("/api/products");

      expect(_body.payload).to.be.an("array").that.is.not.empty;
    });
  });

  describe("/api/products/pid", () => {
    it("GET should return status 200 if pid is defined", async () => {
      const { status } = await requester.get("/api/products/");

      expect(status).to.exist.and.to.be.equal(200);
    });

    it("GET payload should return an object is pid is defined", async () => {
      const { _body } = await requester.get("/api/products");

      expect(_body.payload).to.exist.and.to.be.an("object");
    });

    it("GET payload obect must have property _id", async () => {
      const { _body } = await requester.get("/api/products");

      expect(_body).to.haveOwnProperty("_id");
    });

    it("GET should return status 400 if pid is not defined", async () => {
      const { status } = await requester.get("/api/products/");

      expect(status).to.exist.and.to.be.equal(400);
    });
  });
});
