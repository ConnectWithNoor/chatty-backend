import HTTP_STATUS from 'http-status-codes';
import { userService } from '@services/db/user.service';
import { UserCache } from '@services/redis/user.cache';
import { IUserDocument } from '@user/interfaces/user.interface';
import { Request, Response } from 'express';

const userCache = new UserCache();

class CurrentUser {
  public async read(req: Request, res: Response): Promise<void> {
    let isUser = false;
    let token = null;
    let user = null;

    // check user in the cache
    const cachedUser = (await userCache.getUserFromCache(`${req.currentUser?.userId}`)) as IUserDocument;

    // if no user then check user in db
    const existingUser = cachedUser ? cachedUser : await userService.getUserById(`${req.currentUser?.userId}`);

    if (Object.keys(existingUser).length > 0) {
      isUser = true;
      token = req.session?.jwt;
      user = existingUser;
    }

    res.status(HTTP_STATUS.OK).json({ token, isUser, user });
  }
}

export { CurrentUser };
