import HTTP_STATUS from 'http-status-codes';
import { UploadApiResponse } from 'cloudinary';
import { Request, Response } from 'express';
import { ObjectId } from 'mongodb';

import { IAuthDocument, ISignUpData } from '@auth/interfaces/auth.interface';
import { signupValidation } from '@auth/validations/signup.validation';

import { JoiValidation } from '@decorators/joi-validation.decorators';
import { BadRequestError } from '@global/helpers/error-handler';
import { Helpers } from '@global/helpers/helpers';
import { uploads } from '@global/helpers/cloudinary-upload';

import { authService } from '@services/db/auth.service';

class Signup {
  @JoiValidation(signupValidation)
  public async create(req: Request, res: Response): Promise<void> {
    const { username, password, email, avatarColor, avatarImage } = req.body;

    const checkIfUserExists: IAuthDocument = await authService.getUserByUsernameOrEmail(username, email);

    if (checkIfUserExists) throw new BadRequestError('User already exists.');

    const authId = new ObjectId(); //objectId for auth document
    const userId = new ObjectId(); //objectId for user document
    const uId = `${Helpers.generateRandomIntegers(12)}`; // for redis sorted Set unique id;

    const authData: IAuthDocument = Signup.prototype.signupData({ _id: authId, uId, username, email, password, avatarColor });

    const result = (await uploads(avatarImage, `${userId}`, true, true)) as UploadApiResponse;

    if (!result?.public_id) {
      throw new BadRequestError('File upload: Error occured. Try again');
    }

    res.status(HTTP_STATUS.CREATED).json({ message: 'User created succesfully', authData });
  }

  private signupData(data: ISignUpData): IAuthDocument {
    const { _id, username, password, email, uId, avatarColor } = data;
    return {
      _id,
      uId,
      username: Helpers.toFirstLetterUpperCase(username),
      email: Helpers.toLowerCase(email),
      password,
      avatarColor,
      createdAt: new Date()
    } as unknown as IAuthDocument;
  }
}

export { Signup };
