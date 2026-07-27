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
} from '#/controllers/user';
import { isValidPasswordResetToken, mustAuth } from '#/middlewares/auth';
import { JWT_SECRET } from '#/utils/variables';
import { verify, JwtPayload } from 'jsonwebtoken';
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
authRoutes.get('/is-auth',mustAuth, async (req, res) => {
  try {
    res.json({
      profile: req.user
    });
  } catch (error) {
    console.error('JWT Verification Error:', error);
    return res.status(403).json({ error: 'Invalid or expired token!' });
  }
});
authRoutes.get('/is-auth',mustAuth, async (req, res) => {
  try {
    res.json({
      profile: req.user
    });
  } catch (error) {
    console.error('JWT Verification Error:', error);
    return res.status(403).json({ error: 'Invalid or expired token!' });
  }
});
authRoutes.get('/public', async (req, res) => {
  try {
    res.json({
      message: "you are in public route"
    });
  } catch (error) {
    console.error('JWT Verification Error:', error);
    return res.status(403).json({ error: 'Invalid or expired token!' });
  }
});
authRoutes.get('/private',mustAuth, async (req, res) => {
  try {
    res.json({
      message:"you are in private route"
    });
  } catch (error) {
    console.error('JWT Verification Error:', error);
    return res.status(403).json({ error: 'Invalid or expired token!' });
  }
});
export default authRoutes;
