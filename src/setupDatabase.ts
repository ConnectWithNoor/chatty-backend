import mongoose from 'mongoose';

import { config } from '@root/config';
import { redisConnection } from '@services/redis/redis.connection';

const log = config.createLogger('setupDatabase');

export default () => {
  const connect = () => {
    mongoose
      .connect(config.DATABASE_URI!)
      .then(() => {
        log.info('Successfully connected to the database');
        // connect to redis server after successful db connection
        redisConnection.connect();
      })
      .catch((error) => {
        log.error(`Error connecting database: ${error}`);
        return process.exit(1);
      });
  };

  connect();

  mongoose.connection.on('disconnected', () => {
    log.info('Database connection retrying');
    connect();
  });
};
