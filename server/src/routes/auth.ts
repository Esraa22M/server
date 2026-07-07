import { Router } from 'express';
import {
  CreateUserSchema,
  tokenAndIdVerificationSchema,
  updatePasswordSchema,
} from '#/utils/validationSchema';
import { validateRequest } from '#/middlewares/validator';
import {
  create,
  verifyEmail,
  sendVerificationToken,
  generateForgetpasswordLink,
  grantValid,
  updatePassword,
} from '#/controllers/user';
import { isValidPasswordResetToken } from '#/middlewares/auth';
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
export default authRoutes;
