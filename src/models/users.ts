import { Model, model, Types , Schema } from "mongoose";

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
const UserSchema = new Schema<UserDocument>({
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
export default model("User", UserSchema) as Model<UserDocument>;

