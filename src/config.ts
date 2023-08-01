import bunyan from 'bunyan';
import dotenv from 'dotenv';
import cloudinary from 'cloudinary';

dotenv.config();

class Config {
  public DATABASE_URI: string | undefined;
  public JWT_TOKEN: string | undefined;
  public NODE_ENV: string | undefined;
  public SECRET_KEY_ONE: string | undefined;
  public SECRET_KEY_TWO: string | undefined;
  public CLIENT_URL: string | undefined;
  public REDIS_HOST: string | undefined;
  public CLOUDINARY_NAME: string | undefined;
  public CLOUDINARY_API_KEY: string | undefined;
  public CLOUDINARY_API_SECRET: string | undefined;

  constructor() {
    this.DATABASE_URI = process.env.DATABASE_URI;
    this.JWT_TOKEN = process.env.JWT_TOKEN;
    this.NODE_ENV = process.env.NODE_ENV;
    this.SECRET_KEY_ONE = process.env.SECRET_KEY_ONE;
    this.SECRET_KEY_TWO = process.env.SECRET_KEY_TWO;
    this.CLIENT_URL = process.env.CLIENT_URL;
    this.REDIS_HOST = process.env.REDIS_HOST;
    this.CLOUDINARY_NAME = process.env.CLOUDINARY_NAME;
    this.CLOUDINARY_API_KEY = process.env.CLOUDINARY_API_KEY;
    this.CLOUDINARY_API_SECRET = process.env.CLOUDINARY_API_SECRET;
  }

  public validateConfig(): void {
    for (const [key, value] of Object.entries(this)) {
      if (value === undefined) {
        throw new Error(`Configuration ${key} is undefined`);
      }
    }
  }

  public createLogger(loggerName: string): bunyan {
    return bunyan.createLogger({
      name: loggerName,
      level: 'debug'
    });
  }

  public cloudinaryConfig(): void {
    cloudinary.v2.config({
      cloud_name: this.CLOUDINARY_NAME,
      api_key: this.CLOUDINARY_API_KEY,
      api_secret: this.CLOUDINARY_API_SECRET
    });
  }
}

export const config: Config = new Config();
