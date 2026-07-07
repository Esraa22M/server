import { Model, model, Types, Schema } from 'mongoose';
import { hash, compare } from 'bcrypt';

interface PasswordResetTokenDocument {
  owner: Types.ObjectId;
  token: string;
  createdAt: Date;
}

interface Methods {
  compareToken(token: string): Promise<boolean>;
}

type PasswordResetTokenModel = Model<PasswordResetTokenDocument, {}, Methods>;

const passwordResetTokenSchema = new Schema<PasswordResetTokenDocument, PasswordResetTokenModel, Methods>(
  {
    owner: {
      required: true,
      type: Schema.Types.ObjectId,
      unique: true,
      ref: 'User',
    },
    token: {
      required: true,
      type: String,
    },
    createdAt: {
      type: Date,
      default: Date.now,
      expires: 3600,
    },
  }
);

passwordResetTokenSchema.pre('save', async function () {
  if (this.isModified('token')) {
    this.token = await hash(this.token, 10);
  }
});

passwordResetTokenSchema.methods.compareToken = async function (token) {
  return await compare(token, this.token);
};

export default model<PasswordResetTokenDocument, PasswordResetTokenModel>(
  'PasswordResetToken',
  passwordResetTokenSchema
);

