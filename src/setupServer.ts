import {
  CustomError,
  IErrorResponse,
} from "./shared/globals/helpers/error-handler";
import {
  Application,
  json,
  urlencoded,
  Response,
  Request,
  NextFunction,
} from "express";

import http from "http";
import { Socket, Server as SocketIOServer } from "socket.io";
import { createClient } from "redis";
import HTTP_STATUS from "http-status-codes";
import { createAdapter } from "@socket.io/redis-adapter";

import { NotFoundError } from "@global/helpers/error-handler";
import applicationRoutes from "./routes";

// security
import cors from "cors";
import helmet from "helmet";
import hpp from "hpp";

// standard
import cookieSession from "cookie-session";
import compression from "compression";

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
    this.globalErrorHandler(this.app);
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
        methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
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

  private routesMiddleware(app: Application): void {
    applicationRoutes(app);
  }

  private globalErrorHandler(app: Application): void {
    app.all("*", (req: Request, res: Response) => {
      res
        .status(HTTP_STATUS.NOT_FOUND)
        .json({ message: `${req.originalUrl} not found` });
    });

    app.use(
      (
        error: IErrorResponse,
        _req: Request,
        res: Response,
        next: NextFunction
      ): void => {
        console.log(error);

        if (error instanceof CustomError) {
          res.status(error.statusCode).json(error.serializeErrors());
        }

        next();
      }
    );
  }

  private async startServer(app: Application): Promise<void> {
    try {
      const server: http.Server = new http.Server(app);
      const socketServer: SocketIOServer = await this.createSocketsIO(server);
      this.SocketIOConnections(socketServer);
      this.startHttpServer(server);
    } catch (error) {
      console.log(error);
    }
  }

  private async createSocketsIO(
    httpServer: http.Server
  ): Promise<SocketIOServer> {
    const io: SocketIOServer = new SocketIOServer(httpServer, {
      cors: {
        origin: config.CLIENT_URL,
        credentials: true,
        optionsSuccessStatus: 200,
        methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
      },
    });

    const pubClient = createClient({ url: config.REDIS_HOST });
    const subClient = pubClient.duplicate();

    await Promise.all([pubClient.connect(), subClient.connect()]);
    io.adapter(createAdapter(pubClient, subClient));
    return io;
  }

  private startHttpServer(httpServer: http.Server): void {
    httpServer.listen(SERVER_PORT, () => {
      console.log(`server started on port ${SERVER_PORT}`);
      console.log(`server started on process ${process.pid}`);
    });
  }

  private SocketIOConnections(socketServer: SocketIOServer): void {}
}
