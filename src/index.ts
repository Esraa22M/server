import express from 'express';
import path from 'path';
import { PORT } from './utils/variables';
import authRoutes from './routes/auth';
import mediaRoutes from './routes/media';
import favouriteRoutes from './routes/favourite';
import dotenv from 'dotenv';
dotenv.config();
import './db';
const app = express();
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.urlencoded({ extended: true }));
app.use('/auth', authRoutes);
app.use('/media', mediaRoutes);
app.use('/favourite', favouriteRoutes);
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
