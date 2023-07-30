import HTTP_STATUS from 'http-status-codes';
import { UploadApiResponse } from 'cloudinary';
import { Request, Response } from 'express';
import { ObjectId } from 'mongodb';
import { omit } from 'lodash';
import JWT from 'jsonwebtoken';

import { IAuthDocument, ISignUpData } from '@auth/interfaces/auth.interface';
import { signupValidation } from '@auth/validations/signup.validation';

import { JoiValidation } from '@decorators/joi-validation.decorators';

import { BadRequestError } from '@global/helpers/error-handler';
import { Helpers } from '@global/helpers/helpers';
import { uploads } from '@global/helpers/cloudinary-uploads';
import { ADD_AUTH_USER_TO_DB, ADD_USER_TO_DB } from '@global/constants/constants';

import { authService } from '@services/db/auth.service';
import { UserCache } from '@services/redis/user.cache';
import { authQueue } from '@services/queues/auth.queue';
import { userQueue } from '@services/queues/user.queue';

import { IUserDocument } from '@user/interfaces/user.interface';

import { config } from '@root/config';

const userCache: UserCache = new UserCache();

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

    const cloudinaryResults = (await uploads(avatarImage, 'chatty-images', `${userId}`, true, true)) as UploadApiResponse;

    if (!cloudinaryResults?.public_id) {
      throw new BadRequestError('File upload: Error occured. Try again');
    }

    // Add user data to redis Cache
    const userDataForCache: IUserDocument = Signup.prototype.userData(authData, userId);
    userDataForCache.profilePicture = cloudinaryResults.secure_url;

    await userCache.saveUserToCache(`${userId}`, uId, userDataForCache);

    // add to auth and user queue to insert in database
    // omiting the unwanted keys
    const omitteduserData = omit(userDataForCache, ['uId', 'username', 'email', 'password', 'avatarColor']);
    authQueue.addAuthUserJob(ADD_AUTH_USER_TO_DB, { value: omitteduserData });
    userQueue.addUserJob(ADD_USER_TO_DB, { value: omitteduserData });

    // JWT Token
    const userJWT: string = Signup.prototype.signupToken(authData, userId);
    req.session = { jwt: userJWT };

    res.status(HTTP_STATUS.CREATED).json({ message: 'User created succesfully', user: userDataForCache, token: userJWT });
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

  private userData(data: IAuthDocument, userObjectId: ObjectId): IUserDocument {
    const { _id, username, email, uId, password, avatarColor } = data;
    return {
      _id: userObjectId,
      authId: _id,
      uId,
      username: Helpers.toFirstLetterUpperCase(username),
      email,
      password,
      avatarColor,
      profilePicture: '',
      blocked: [],
      blockedBy: [],
      work: '',
      location: '',
      school: '',
      quote: '',
      bgImageVersion: '',
      bgImageId: '',
      followersCount: 0,
      followingCount: 0,
      postsCount: 0,
      notifications: {
        messages: true,
        reactions: true,
        comments: true,
        follows: true
      },
      social: {
        facebook: '',
        instagram: '',
        twitter: '',
        youtube: ''
      }
    } as unknown as IUserDocument;
  }

  private signupToken(data: IAuthDocument, userId: ObjectId): string {
    return JWT.sign(
      { userId, uId: data.uId, email: data.email, username: data.username, avatarColor: data.avatarColor },
      config.JWT_TOKEN!
    );
  }
}

export { Signup };
