import { MediaDocument } from "#/models/media";
import { ObjectId } from "mongoose";

export type PopulatedFavouriteListItem =  MediaDocument<{_id: ObjectId , name: string}>