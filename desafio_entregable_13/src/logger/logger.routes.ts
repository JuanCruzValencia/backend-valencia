import express from "express"
import { getLoggerTest } from "./logger.controller.ts";

const Router = express.Router();

Router.get('/', getLoggerTest)

export default Router;