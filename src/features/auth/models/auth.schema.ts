import { compare, hash } from 'bcrypt';
import mongoose, { Schema, model } from 'mongoose';

import { IAuthDocument } from '@auth/interfaces/auth.interface';
import { SALT_ROUND } from '@global/constants/constants';

const authSchema = new Schema<IAuthDocument>(
  {
    username: { type: mongoose.SchemaTypes.String },
    uId: { type: mongoose.SchemaTypes.String }, // for redis sorted set unique id
    email: { type: mongoose.SchemaTypes.String },
    password: { type: mongoose.SchemaTypes.String },
    avatarColor: { type: mongoose.SchemaTypes.String },
    createdAt: { type: mongoose.SchemaTypes.Date, default: Date.now },
    passwordResetToken: { type: mongoose.SchemaTypes.String, default: '' },
    passwordResetExpiresIn: { type: mongoose.SchemaTypes.Number }
  },
  {
    // toJSON runs when request is made to retreive from db.
    // remove password when data is fetched from db.
    toJSON: {
      transform(_doc, ret) {
        delete ret.password;
        return ret;
      }
    }
  }
);

authSchema.pre('save', async function (this: IAuthDocument, next) {
  const hashedPassword = await hash(this.password!, SALT_ROUND);
  this.password = hashedPassword;
  next();
});

authSchema.methods.comparePassword = async function (password: string): Promise<boolean> {
  const hashedPassword = (this as IAuthDocument).password!;
  return compare(password, hashedPassword);
};

authSchema.methods.hashPassword = async function (password: string): Promise<string> {
  return hash(password, SALT_ROUND);
};

const AuthModel = model<IAuthDocument>('Auth', authSchema, 'Auth');

export { AuthModel };
