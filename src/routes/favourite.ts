import { toggleFavourite } from '#/controllers/favourite';
import { isVerified, mustAuth } from '#/middlewares/auth';
import { Router } from 'express';

const favouriteRoutes = Router();

favouriteRoutes.post('/', mustAuth, isVerified, toggleFavourite);
favouriteRoutes.get('/', mustAuth, getFavourites);
export default favouriteRoutes;