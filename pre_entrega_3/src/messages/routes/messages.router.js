import express from "express";
import { getChatPage } from "../controllers/messages.controller";

const Router = express.Router();

Router.get("/", getChatPage);

export default Router;
