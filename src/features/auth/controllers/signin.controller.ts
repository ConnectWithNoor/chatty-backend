import { Request, Response } from 'express';
import JWT from 'jsonwebtoken';
import HTTP_STATUS from 'http-status-codes';

import { config } from '@root/config';

import { JoiValidation } from '@decorators/joi-validation.decorators';
import { authService } from '@services/db/auth.service';
import { signinValidation } from '@auth/validations/signin.validations';
import { BadRequestError } from '@global/helpers/error-handler';
import { IAuthDocument } from '@auth/interfaces/auth.interface';

class Signin {
  @JoiValidation(signinValidation)
  public async read(req: Request, res: Response): Promise<void> {
    const { username, password } = req.body;

    const existingUser: IAuthDocument = await authService.getAuthUserByUsername(username);

    // if user dont exist
    if (!existingUser) throw new BadRequestError('Invalid credentials.');

    const passwordMatched = await existingUser.comparePassword(password);

    // if password dont match
    if (!passwordMatched) throw new BadRequestError('Invalid credentials.');

    const userJWT: string = Signin.prototype.signinToken(existingUser);
    req.session = { jwt: userJWT };

    res.status(HTTP_STATUS.OK).json({ message: 'User login succesfully', user: existingUser, token: userJWT });
  }

  private signinToken(data: IAuthDocument): string {
    return JWT.sign(
      { userId: data._id, uId: data.uId, email: data.email, username: data.username, avatarColor: data.avatarColor },
      config.JWT_TOKEN!
    );
  }
}

export { Signin };
