import { Router } from 'express';
import {
  CreateUserSchema,
  SignInValiadtionSchema,
  tokenAndIdVerificationSchema,
  updatePasswordSchema,
} from '#/utils/validationSchema';
import User from '#/models/users';
import { validateRequest } from '#/middlewares/validator';
import {
  create,
  verifyEmail,
  sendVerificationToken,
  generateForgetpasswordLink,
  grantValid,
  updatePassword,
  SignIn,
  updateProfile,
} from '#/controllers/user';
import path from 'path';
import fs from 'fs';
import { isValidPasswordResetToken, mustAuth } from '#/middlewares/auth';
import formidable from 'formidable';
import { error } from 'console';
import { fileParser, RequestWithFiles } from '#/middlewares/fileParser';
const authRoutes = Router();
authRoutes.post('/create', validateRequest(CreateUserSchema), create);
authRoutes.post(
  '/verify-email',
  validateRequest(tokenAndIdVerificationSchema),
  verifyEmail
);
authRoutes.post('/re-verify-email', sendVerificationToken);
authRoutes.post('/forgot-password', generateForgetpasswordLink);
authRoutes.post(
  '/verify-forgot-password',
  validateRequest(tokenAndIdVerificationSchema),
  isValidPasswordResetToken,
  grantValid
);
authRoutes.post(
  '/update-password',
  validateRequest(updatePasswordSchema),
  isValidPasswordResetToken,
  updatePassword
);
authRoutes.post('/sign-in', validateRequest(SignInValiadtionSchema), SignIn);
authRoutes.get('/is-auth', mustAuth, async (req, res) => {
  try {
    res.json({
      profile: req.user,
    });
  } catch (error) {
    console.error('JWT Verification Error:', error);
    return res.status(403).json({ error: 'Invalid or expired token!' });
  }
});
authRoutes.get('/is-auth', mustAuth, async (req, res) => {
  try {
    res.json({
      profile: req.user,
    });
  } catch (error) {
    console.error('JWT Verification Error:', error);
    return res.status(403).json({ error: 'Invalid or expired token!' });
  }
});
authRoutes.get('/public', async (req, res) => {
  try {
    res.json({
      message: 'you are in public route',
    });
  } catch (error) {
    console.error('JWT Verification Error:', error);
    return res.status(403).json({ error: 'Invalid or expired token!' });
  }
});
authRoutes.get('/private', mustAuth, async (req, res) => {
  try {
    res.json({
      message: 'you are in private route',
    });
  } catch (error) {
    console.error('JWT Verification Error:', error);
    return res.status(403).json({ error: 'Invalid or expired token!' });
  }
});

authRoutes.post('/update-profile',mustAuth ,fileParser, updateProfile);
export default authRoutes;
