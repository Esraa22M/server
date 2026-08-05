import { isVerified, mustAuth } from '#/middlewares/auth';
import { fileParser } from '#/middlewares/fileParser';
import { validateRequest } from '#/middlewares/validator';
import { mediaValidationSchema } from '#/utils/validationSchema';
import { createMedia, updateMedia } from '#/controllers/media';
import Router from 'express';
const mediaRouter = Router();
//only authenticated and verified users can create media
mediaRouter.post("/create", mustAuth , isVerified, fileParser, validateRequest(mediaValidationSchema), createMedia)
mediaRouter.patch("/update/:mediaId", mustAuth , isVerified, fileParser, validateRequest(mediaValidationSchema), updateMedia)

export default mediaRouter;