import { getFavourites, getIsFavourite, toggleFavourite } from '#/controllers/favourite';
import { isVerified, mustAuth } from '#/middlewares/auth';
import { Router } from 'express';

const favouriteRoutes = Router();

favouriteRoutes.post('/', mustAuth, isVerified, toggleFavourite);
favouriteRoutes.get('/', mustAuth, getFavourites);
favouriteRoutes.get('/is-fav', mustAuth, getIsFavourite);
export default favouriteRoutes;