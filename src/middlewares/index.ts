import { json } from "express";
import apolloMiddleware from "./apolloServer.js";
import cors from "cors";

export default [cors(), json(), [apolloMiddleware, "/graphql"]];
