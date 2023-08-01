import { Request, Response, NextFunction } from 'express';
import JWT from 'jsonwebtoken';

import { config } from '@root/config';
import { NotAuthorizedError } from '../error-handler';
import { AuthPayload } from '@auth/interfaces/auth.interface';

class AuthMiddleware {
  public verifyUser(req: Request, _res: Response, next: NextFunction): void {
    // no token

    if (!req.session?.jwt) {
      throw new NotAuthorizedError('Token is not avaialble. Please login again');
    }

    try {
      // verify token is not expired and valid
      const payload = JWT.verify(req.session?.jwt, `${config.JWT_TOKEN}`) as AuthPayload;
      req.currentUser = payload;
      next();
    } catch (error) {
      throw new NotAuthorizedError('Invalid token. Please login again');
    }
  }

  public checkAuthentication(req: Request, _res: Response, next: NextFunction): void {
    // no token
    if (!req.currentUser) {
      throw new NotAuthorizedError('Authentication is required to access this route.');
    }
    next();
  }
}

const authMiddleware = new AuthMiddleware();

export { authMiddleware };
