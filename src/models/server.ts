import express from "express";
import * as http from "http";
import { curry, each, pipe } from "@fxts/core";

class InmutableServer {
  private server: http.Server;
  constructor(HTTP_server: http.Server) {
    this.server = HTTP_server;
  }
  listen(port: number) {
    this.server.listen(port, () => {
      console.log("Server running on port " + port);
    });
  }
}

const setup_conf = curry<any>(
  (configurations: any[], app: express.Application): express.Application => {
    const setup_middleware = (conf: Function | any[]) => {
      if (typeof conf === "function") return app.use(conf as any);

      const [middleware, route] = conf;

      return app.use(route, middleware);
    };

    each(setup_middleware, configurations);

    return app;
  },
);

const setup_server = (server_params: any): InmutableServer => {
  const { configurations, app } = server_params;

  return pipe(
    app(),
    setup_conf(configurations),
    http.createServer,
    (server: http.Server) => new InmutableServer(server),
    Object.freeze,
  ) as any;
};

export default setup_server;
