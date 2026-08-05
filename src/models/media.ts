import { ObjectId, Schema, model, models } from 'mongoose';
import { categories, categoriesTypes } from '../utils/media_category';

export interface MediaDocument {
  title: string;
  about: string;
  Owner: ObjectId;
  file: { url: string; publicId: string };
  poster?: { url: string; publicId: string };
  likes: ObjectId[];
  category: categoriesTypes;
}

const mediaSchema = new Schema<MediaDocument>(
  {
    title: { type: String, required: true },
    Owner: { type: Schema.Types.ObjectId, ref: 'User' },
    about: { type: String, required: true },
    file: { type: Object, url: String, publicId: String, required: true },
    poster: { type: Object, url: String, publicId: String },
    likes: [{ type: Schema.Types.ObjectId, ref: 'User' }],
    category: { type: String, enum: categories, default: 'Others' },
  },
  { timestamps: true }
);

const Media = models.Media || model<MediaDocument>('Media', mediaSchema);

export default Media;
