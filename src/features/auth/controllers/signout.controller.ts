import HTTP_STATUS from 'http-status-codes';
import { Request, Response } from 'express';

class Signout {
  public async update(req: Request, res: Response): Promise<void> {
    req.session = null;
    res.status(HTTP_STATUS.OK).json({ message: 'logout successful' });
  }
}

export { Signout };
