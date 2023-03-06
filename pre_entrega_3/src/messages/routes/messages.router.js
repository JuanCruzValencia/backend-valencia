import express from "express";
import { authPolicies, authToken } from "../../utils/jwt";
import { getChatPage } from "../controllers/messages.controller";

const Router = express.Router();

Router.get("/", authToken, authPolicies("USER"), getChatPage);

export default Router;
