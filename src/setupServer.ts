import { Application, json, urlencoded, Response, Request, NextFunction } from 'express';
import http from 'http';
import { Server as SocketIOServer } from 'socket.io';
import { createClient } from 'redis';
import HTTP_STATUS from 'http-status-codes';
import { createAdapter } from '@socket.io/redis-adapter';

import { CustomError, IErrorResponse } from '@global/helpers/error-handler';

import applicationRoutes from '@root/routes';

// security
import cors from 'cors';
import helmet from 'helmet';
import hpp from 'hpp';

// standard
import cookieSession from 'cookie-session';
import compression from 'compression';
import cookieParser from 'cookie-parser';

// errorhandler
import 'express-async-errors';
import { config } from './config';

const SERVER_PORT = 5000;
const log = config.createLogger('setupServer');

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
    // cookies
    app.use(
      cookieSession({
        name: 'session',
        keys: [config.SECRET_KEY_ONE!, config.SECRET_KEY_TWO!],
        maxAge: 24 * 7 * 3600000, // 7 days
        secure: config.NODE_ENV !== 'development' // true for prod, false for dev
      })
    );

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
        methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS']
      })
    );
  }

  private standardMiddleware(app: Application): void {
    // compression
    app.use(compression());

    // json-parser
    app.use(
      json({
        limit: '50mb'
      })
    );

    // cookie-parser
    app.use(cookieParser());
    // urlencoded
    app.use(urlencoded({ extended: true, limit: '50mb' }));
  }

  private routesMiddleware(app: Application): void {
    applicationRoutes(app);
  }

  private globalErrorHandler(app: Application): void {
    // catch error for endpoints that do not exist
    app.all('*', (req: Request, res: Response) => {
      res.status(HTTP_STATUS.NOT_FOUND).json({ message: `${req.originalUrl} not found` });
    });

    app.use((error: IErrorResponse, _req: Request, res: Response, next: NextFunction) => {
      log.error(error);
      if (error instanceof CustomError) {
        res.status(error.statusCode).json(error.serializeErrors());
      }
      next();
    });
  }

  private async startServer(app: Application): Promise<void> {
    if (!config.JWT_TOKEN) {
      throw new Error('JWT_TOKEN must be provided');
    }
    try {
      const server: http.Server = new http.Server(app);
      const socketServer: SocketIOServer = await this.createSocketsIO(server);
      this.startHttpServer(server);
      this.SocketIOConnections(socketServer);
    } catch (error) {
      log.error(error);
    }
  }

  private async createSocketsIO(httpServer: http.Server): Promise<SocketIOServer> {
    const io: SocketIOServer = new SocketIOServer(httpServer, {
      cors: {
        origin: config.CLIENT_URL,
        methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS']
      }
    });

    const pubClient = createClient({ url: config.REDIS_HOST });
    const subClient = pubClient.duplicate();

    await Promise.all([pubClient.connect(), subClient.connect()]);
    io.adapter(createAdapter(pubClient, subClient));
    return io;
  }

  private startHttpServer(httpServer: http.Server): void {
    httpServer.listen(SERVER_PORT, () => {
      log.info(`server started on port ${SERVER_PORT}`);
      log.info(`server started on process ${process.pid}`);
    });
  }

  private SocketIOConnections(socketServer: SocketIOServer): void {
    // todo
  }
}
