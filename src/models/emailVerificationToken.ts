import { Model, model, Types, Schema } from 'mongoose';
import { hash, compare } from 'bcrypt';

interface EmailVerificationTokenDocument {
  owner: Types.ObjectId;
  token: string;
  createdAt: Date;
}

interface Methods {
  compareToken(token: string): Promise<boolean>;
}

type EmailVerificationTokenModel = Model<EmailVerificationTokenDocument, {}, Methods>;

const emailVerificationTokenSchema = new Schema<EmailVerificationTokenDocument, EmailVerificationTokenModel, Methods>(
  {
    owner: {
      required: true,
      type: Schema.Types.ObjectId,
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

emailVerificationTokenSchema.pre('save', async function () {
  if (this.isModified('token')) {
    this.token = await hash(this.token, 10);
  }
});

emailVerificationTokenSchema.methods.compareToken = async function (token) {
  return await compare(token, this.token);
};

export default model<EmailVerificationTokenDocument, EmailVerificationTokenModel>(
  'EmailVerificationToken',
  emailVerificationTokenSchema
);

