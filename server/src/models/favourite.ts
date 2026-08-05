import { model, models, Types, Schema } from 'mongoose';

interface FavouriteDocument {
  owner: Types.ObjectId;
  items: Types.ObjectId[];
}

const favouritesSchema = new Schema<FavouriteDocument>(
  {
    owner: { type: Schema.Types.ObjectId, ref: 'User' },
    items: [{ type: Schema.Types.ObjectId, ref: 'Media' }],
  },
  { timestamps: true }
);

const Favourite = models.Favourite || model<FavouriteDocument>('Favourite', favouritesSchema);

export default Favourite;
