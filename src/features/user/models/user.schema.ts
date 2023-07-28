import mongoose, { Schema, model } from 'mongoose';

import { IUserDocument } from '@user/interfaces/user.interface';

const userSchema = new Schema<IUserDocument>({
  authId: { type: mongoose.SchemaTypes.ObjectId, ref: 'Auth' },
  profilePicture: { type: mongoose.SchemaTypes.String, default: '' },
  postsCount: { type: mongoose.SchemaTypes.Number, default: 0 },
  followersCount: { type: mongoose.SchemaTypes.Number, default: 0 },
  followingCount: { type: mongoose.SchemaTypes.Number, default: 0 },
  passwordResetToken: { type: mongoose.SchemaTypes.String, default: '' },
  passwordResetExpiresIn: { type: mongoose.SchemaTypes.Number },
  blocked: [{ type: mongoose.SchemaTypes.ObjectId, ref: 'User' }],
  blockedBy: [{ type: mongoose.SchemaTypes.ObjectId, ref: 'User' }],
  notifications: {
    messages: { type: mongoose.SchemaTypes.Boolean, default: true },
    reactions: { type: mongoose.SchemaTypes.Boolean, default: true },
    comments: { type: mongoose.SchemaTypes.Boolean, default: true },
    follows: { type: mongoose.SchemaTypes.Boolean, default: true }
  },
  social: {
    facebook: { type: mongoose.SchemaTypes.String, default: '' },
    instagram: { type: mongoose.SchemaTypes.String, default: '' },
    twitter: { type: mongoose.SchemaTypes.String, default: '' },
    youtube: { type: mongoose.SchemaTypes.String, default: '' }
  },
  work: { type: mongoose.SchemaTypes.String, default: '' },
  school: { type: mongoose.SchemaTypes.String, default: '' },
  location: { type: mongoose.SchemaTypes.String, default: '' },
  quote: { type: mongoose.SchemaTypes.String, default: '' },
  bgImageVersion: { type: mongoose.SchemaTypes.String, default: '' },
  bgImageId: { type: mongoose.SchemaTypes.String, default: '' }
});

const UserModel = model<IUserDocument>('User', userSchema, 'User');
export { UserModel };
