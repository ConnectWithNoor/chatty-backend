import {
  Application,
  json,
  urlencoded,
  Response,
  Request,
  NextFunction,
} from "express";

import http from "http";
import { Server as SocketIOServer } from "socket.io";
import { createClient } from "redis";
import { createAdapter } from "@socket.io/redis-adapter";

// security
import cors from "cors";
import helmet from "helmet";
import hpp from "hpp";

// standard
import cookieSession from "cookie-session";
import compression from "compression";
import cookieParser from "cookie-parser";
import HTTP_STATUS from "http-status-codes";

// errorhandler
import "express-async-errors";
import { config } from "./config";

const SERVER_PORT = 5000;

export class ChattyServer {
  private app: Application;

  constructor(app: Application) {
    this.app = app;
  }

  public start(): void {
    this.securityMiddleware(this.app);
    this.standardMiddleware(this.app);
    this.routesMiddleware(this.app);
    this.globalHandler(this.app);
    this.startServer(this.app);
  }

  private securityMiddleware(app: Application): void {
    // hpp
    app.use(hpp());
    // helmet
    app.use(helmet());
    // cors
    app.use(
      cors({
        origin: config.CLIENT_URL,
        credentials: true,
        optionsSuccessStatus: 200,
        methods: ["GET", "POST", "PUT", "DELETE"],
      })
    );
  }

  private standardMiddleware(app: Application): void {
    // cookies
    app.use(
      cookieSession({
        name: "session",
        keys: [config.SECRET_KEY_ONE!, config.SECRET_KEY_TWO!],
        maxAge: 24 * 7 * 3600000, // 7 days
        secure: config.NODE_ENV !== "development",
      })
    );

    // compression
    app.use(compression());

    // json-parser
    app.use(
      json({
        limit: "50mb",
      })
    );
    // urlencoded
    app.use(urlencoded({ extended: true, limit: "50mb" }));
  }

  private routesMiddleware(app: Application): void {}

  private globalHandler(app: Application): void {}

  private async startServer(app: Application): Promise<void> {
    try {
      const server: http.Server = new http.Server(app);
      this.startHttpServer(server);
    } catch (error) {
      console.log(error);
    }
  }

  private createSocketsIO(httpServer: http.Server): void {}

  private startHttpServer(httpServer: http.Server): void {
    httpServer.listen(SERVER_PORT, () => {
      console.log(`Server started on port ${SERVER_PORT}`);
    });
  }
}
