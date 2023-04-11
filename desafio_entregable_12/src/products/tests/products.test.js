import supertest from "supertest";
import chai from "chai";
import dotenv from "dotenv";
dotenv.config();

const expect = chai.expect;
const requester = supertest(process.env.BASE_URL);

describe("Testing products endpoint", () => {
  describe("/api/products", () => {
    const newProduct = {};

    it("GET should return status 200", async () => {
      const { status } = await requester.get("/api/products");

      expect(status).to.exist.and.to.be.equal(200);
    });

    it("GET should return an array", async () => {
      const { _body } = await requester.get("/api/products");

      expect(_body.payload).to.be.an("array").that.is.not.empty;
    });

    it("POST a new product should return status 200 if all required properties was sended", async () => {
      const { status } = requester.post("/api/products").send(newProduct);

      expect(status).to.exist.and.to.be.equal(200);
    });

    it("POST a new product should return status 400 if any of the required properties was undefined", async () => {
      const { status } = requester.post("/api/products").send(newProduct);

      expect(status).to.exist.and.to.be.equal(200);
    });

    it("POST must save the product in DB with a new _id property", async () => {
      const { status } = requester.post("/api/products").send(newProduct);

      expect(status).to.exist.and.to.be.equal(200);
    });
  });

  describe("/api/products/pid", () => {
    const pid = "63bf146e58e7baa835ee6870";

    it("GET should return status 200 if pid is defined", async () => {
      const { status } = await requester.get(`/api/products/${pid}`);

      expect(status).to.exist.and.to.be.equal(200);
    });

    it("GET payload should return an object is pid is defined", async () => {
      const { _body } = await requester.get(`/api/products/${pid}`);

      expect(_body.payload).to.exist.and.to.be.an("object");
    });

    it("GET payload object must have property _id", async () => {
      const { _body } = await requester.get(`/api/products/${pid}`);

      expect(_body.payload).to.haveOwnProperty("_id");
    });

    it("GET should return status 400 if pid is not defined", async () => {
      const { status } = await requester.get(`/api/products/123456`);

      expect(status).to.exist.and.to.be.equal(400);
    });
  });
});
