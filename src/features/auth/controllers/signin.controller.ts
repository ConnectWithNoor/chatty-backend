import { Request, Response } from 'express';
import JWT from 'jsonwebtoken';
import HTTP_STATUS from 'http-status-codes';

import { config } from '@root/config';

import { JoiValidation } from '@decorators/joi-validation.decorators';
import { authService } from '@services/db/auth.service';
import { userService } from '@services/db/user.service';
import { signinValidation } from '@auth/validations/signin.validations';
import { IAuthDocument } from '@auth/interfaces/auth.interface';
import { BadRequestError } from '@global/helpers/error-handler';
import { IUserDocument } from '@user/interfaces/user.interface';

class Signin {
  @JoiValidation(signinValidation)
  public async read(req: Request, res: Response): Promise<void> {
    const { username, password } = req.body;

    // Auth Document
    const existingUser: IAuthDocument = await authService.getAuthUserByUsername(username);

    // if user dont exist
    if (!existingUser) throw new BadRequestError('Invalid credentials.');

    const passwordMatched = await existingUser.comparePassword(password);

    // if password dont match
    if (!passwordMatched) throw new BadRequestError('Invalid credentials.');

    // get User document
    const user: IUserDocument = await userService.getUserByAuthId(`${existingUser._id}`);

    const userJWT: string = Signin.prototype.signinToken(existingUser, user);
    req.session = { jwt: userJWT };

    const userDetails: IUserDocument = {
      ...user,
      authId: existingUser._id,
      username: existingUser.username,
      email: existingUser.email,
      avatarColor: existingUser.avatarColor,
      uId: existingUser.uId,
      createdAt: existingUser.createdAt
    } as IUserDocument;

    res.status(HTTP_STATUS.OK).json({ message: 'User login succesfully', user: userDetails, token: userJWT });
  }

  private signinToken(authUser: IAuthDocument, user: IUserDocument): string {
    return JWT.sign(
      { userId: user._id, uId: authUser.uId, email: authUser.email, username: authUser.username, avatarColor: authUser.avatarColor },
      config.JWT_TOKEN!
    );
  }
}

export { Signin };
