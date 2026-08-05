import { RequestWithFiles } from '#/middlewares/fileParser';
import { RequestHandler } from 'express';
import formidable from 'formidable';
import cloudinary from '#/cloud';
import Media from '#/models/media';
import { categoriesTypes } from '#/utils/media_category';

interface createMediaRequest extends RequestWithFiles {
  body: {
    title: string;
    about: string;
    category: categoriesTypes;
  };
}
export const createMedia: RequestHandler = async (
  req: createMediaRequest,
  res
) => {
  const { title, about, category } = req.body;
  const poster = req.files?.poster as formidable.File;
  const mediaFile = req.files?.file as formidable.File;
  const ownerId = req.user?.id;
  if (!mediaFile) {
    return res.status(422).json({ error: 'audio file is missing!' });
  }
  const mediaRes = await cloudinary.uploader.upload(mediaFile.filepath, {
    resource_type: 'video',
  });
  const newMedia = new Media({
    title,
    about,
    category,
    Owner: ownerId,
    file: {
      url: mediaRes.url,
      publicId: mediaRes.public_id,
    },
  });
  if (poster) {
    const posterRes = await cloudinary.uploader.upload(poster.filepath, {
      width: 300,
      height: 300,
      crop: 'thumb',
      gravity: 'face',
    });
    newMedia.poster = {
      url: posterRes.secure_url,
      publicId: posterRes.public_id,
    };
  }
  await newMedia.save();
  res.status(201).json({
    media: {
      title,
      about,
      file: newMedia.file.url,
      poster: newMedia.poster?.url,
    },
  });
};
export const updateMedia: RequestHandler = async (
  req: createMediaRequest,
  res
) => {
  const { title, about, category } = req.body;
  const poster = req.files?.poster as formidable.File | undefined;
  const mediaFile = req.files?.file as formidable.File | undefined;
  const ownerId = req.user?.id;
  const { mediaId } = req.params;

  const media = await Media.findOne({ Owner: ownerId, _id: mediaId });
  if (!media) return res.status(404).json({ error: 'Media not found!' });

  if (title) media.title = title;
  if (about) media.about = about;
  if (category) media.category = category;

  if (mediaFile) {
    if (media.file?.publicId) {
      await cloudinary.uploader.destroy(media.file.publicId, {
        resource_type: 'video',
      });
    }

    const mediaRes = await cloudinary.uploader.upload(mediaFile.filepath, {
      resource_type: 'video',
    });

    media.file = {
      url: mediaRes.secure_url,
      publicId: mediaRes.public_id,
    };
  }

  if (poster) {
    if (media.poster?.publicId) {
      await cloudinary.uploader.destroy(media.poster.publicId);
    }

    const posterRes = await cloudinary.uploader.upload(poster.filepath, {
      width: 300,
      height: 300,
      crop: 'thumb',
      gravity: 'face',
    });

    media.poster = {
      url: posterRes.secure_url,
      publicId: posterRes.public_id,
    };
  }

  await media.save();

  return res.status(200).json({
    media: {
      title: media.title,
      about: media.about,
      file: media.file.url,
      poster: media.poster?.url,
    },
  });
};
