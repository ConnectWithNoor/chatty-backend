import express, { Express } from "express";

import { ChattyServer } from "@root/setupServer";
import databaseConnection from "@root/setupDatabase";

class Application {
  public initialize(): void {
    databaseConnection();
    const app: Express = express();
    const server: ChattyServer = new ChattyServer(app);

    server.start();
  }
}

const application = new Application();
application.initialize();
