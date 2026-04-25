import express from 'express'; 
import { PORT } from './utils/variables';
import authRoutes from './routes/auth';
import dotenv from 'dotenv';
dotenv.config();
import './db';

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use("/auth", authRoutes);
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
