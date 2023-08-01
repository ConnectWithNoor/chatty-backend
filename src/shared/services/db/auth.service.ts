import { IAuthDocument } from '@auth/interfaces/auth.interface';
import { AuthModel } from '@auth/models/auth.schema';

import { Helpers } from '@global/helpers/helpers';

class AuthService {
  public async getUserByUsernameOrEmail(username: string, email: string): Promise<IAuthDocument> {
    const query = {
      $or: [{ username: Helpers.toFirstLetterUpperCase(username) }, { email: Helpers.toLowerCase(email) }]
    };

    const user = (await AuthModel.findOne(query).exec()) as IAuthDocument;

    return user;
  }

  public async getAuthUserByUsername(username: string): Promise<IAuthDocument> {
    const user = (await AuthModel.findOne({ username: Helpers.toFirstLetterUpperCase(username) }).exec()) as IAuthDocument;
    return user;
  }

  public async createAuthUser(data: IAuthDocument): Promise<void> {
    await AuthModel.create(data);
  }
}

const authService = new AuthService();

export { authService };
