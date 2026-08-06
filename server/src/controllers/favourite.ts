import Favourite from '#/models/favourite';
import Media, { MediaDocument } from '#/models/media';
import { RequestHandler } from 'express';
import { isValidObjectId, Types } from 'mongoose';
import { ObjectId } from 'mongoose';
import { PopulatedFavouriteListItem } from '#/@types/audio';
export const toggleFavourite: RequestHandler = async (req, res) => {
  let status: 'added' | 'removed';

  const mediaId = (req.body?.mediaId ?? req.query?.mediaId) as
    | string
    | undefined;
  if (!mediaId || !isValidObjectId(mediaId)) {
    return res.status(400).json({ error: 'Invalid mediaId' });
  }

  const mediaObjectId = new Types.ObjectId(mediaId);
  const ownerObjectId =
    req.user?.id instanceof Types.ObjectId
      ? req.user.id
      : new Types.ObjectId(String(req.user?.id));

  const media = await Media.findById(mediaObjectId);
  if (!media) {
    return res.status(404).json({ error: 'Media not found' });
  }

  const isAlreadyFavourited = await Favourite.findOne({
    owner: ownerObjectId,
    items: mediaObjectId,
  });
  
  if (isAlreadyFavourited) {
    await Favourite.updateOne(
      { owner: ownerObjectId },
      { $pull: { items: mediaObjectId } }
    );
    status = 'removed';
  } else {
    const favourite = await Favourite.findOne({ owner: ownerObjectId });
    if (favourite) {
      await Favourite.updateOne(
        { owner: ownerObjectId },
        { $addToSet: { items: mediaObjectId } }
      );
    } else {
      await Favourite.create({ owner: ownerObjectId, items: [mediaObjectId] });
    }
    status = 'added';
  }
  if (status === 'added') {
    await Media.findByIdAndUpdate(mediaObjectId, {
      $addToSet: { likes: req.user.id },
    });
  }
  if (status === 'removed') {
    await Media.findByIdAndUpdate(mediaObjectId, {
      $pull: { likes: req.user.id },
    });
  }
  return res.json({
    message: `Media ${status} to favourites successfully`,
    media: { title: media.title, id: media._id },
  });
};

export const getFavourites: RequestHandler = async (req, res) => {
  const userId = req.user?.id;
  if (!userId) {
    return res.status(400).json({ error: 'User not authenticated' });
  }
  const favourite = await Favourite.findOne({ owner: userId }).populate<{items:MediaDocument<{_id: ObjectId , name: string}>[]}>({
    path: 'items',
    populate: { path: 'Owner' },
  });
  if(!favourite) {
    return res.status(404).json({ error: 'No favourites found for this user' });
  }
  const mediaItems = favourite.items.map((item: PopulatedFavouriteListItem) => {
    return {
      id: item.id,
      title: item.title,
      category: item.category,
      filePath: item.file.url,
      poster:item.poster?.url,
      owner: {name: item.Owner?.name, id: item.Owner?._id},
    }
  });
  res.json({
   mediaItems: mediaItems,
  });
};

export const getIsFavourite:RequestHandler = async (req, res) => {
  const mediaId = req.query?.mediaId as string | undefined;
  if (!mediaId || !isValidObjectId(mediaId)) {
    return res.status(400).json({ error: 'Invalid mediaId' });
    
  }
  const favourite = await Favourite.findOne({ owner: req.user?.id , items: mediaId });
  res.json({ isFavourite: !!favourite });

}