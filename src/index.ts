import middlewares from "./middlewares/index.js";
import setup_server from "./models/server.js";
import express from "express";
import "dotenv/config";
import dbConnection from "./database/config.js";

await dbConnection();

const server_params = {
  configurations: [...middlewares /*, ...routes*/],
  app: express,
};

setup_server(server_params).listen(3000);
