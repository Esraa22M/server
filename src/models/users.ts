import { compare, hash } from "bcrypt";
import { Model, model, Types , Schema } from "mongoose";
interface Methods{
    comparePassword(password: string): Promise<boolean>;
}
interface UserDocument {
    name: string;
    email: string;
    password: string;
    verified: boolean;
    avatar?: {url: string, publicId: string};
    tokens: string[];
    favorites: Types.ObjectId[];
    following: Types.ObjectId[];  
    followers: Types.ObjectId[];
}
const UserSchema = new Schema<UserDocument,{}, Methods>({
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true , trim: true},
    password: { type: String, required: true },
    avatar: { type: {url: String, publicId: String}},

    verified: { type: Boolean, default: false }, 
    favorites: [{ type: Schema.Types.ObjectId, ref: "Media" }],
    following: [{ type: Schema.Types.ObjectId, ref: "User" }],
    followers: [{ type: Schema.Types.ObjectId, ref: "User" }],
    tokens: [{ type: String }] , 

},{ timestamps: true });
UserSchema.pre('save', async function () {
  if (this.isModified('password')) {
    this.password = await hash(this.password, 10);
  }
});

UserSchema.methods.comparePassword = async function (password) {
  return await compare(password, this.password);
};
export default model("User", UserSchema) as Model<UserDocument,{}, Methods  >;

