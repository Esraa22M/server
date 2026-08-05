import Favourite from '#/models/favourite';
import Media from '#/models/media';
import { RequestHandler } from 'express';
import { isValidObjectId, Types } from 'mongoose';

export const toggleFavourite: RequestHandler = async (req, res) => {
  let status: 'added' | 'removed';

  const mediaId = (req.body?.mediaId ?? req.query?.mediaId) as string | undefined;
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
    await Media.findByIdAndUpdate(
       mediaObjectId ,
      { $addToSet: { likes: req.user.id } }
    );
  }
    if (status === 'removed') {
    await Media.findByIdAndUpdate(
       mediaObjectId ,
      { $pull: { likes: req.user.id } }
    );
  }
  return res.json({
    message: `Media ${status} to favourites successfully`,
    media: { title: media.title, id: media._id }
  });
};

export const getFavourites: RequestHandler = async (req, res) => {
    const userId = req.user?.id;
    if (!userId) {
        return res.status(400).json({ error: 'User not authenticated' });
    }
    
}