import { RequestHandler } from 'express';
import { isValidObjectId } from 'mongoose';
import PasswordResetToken from '#/models/passwordRessetToken';

export const isValidPasswordResetToken: RequestHandler = async (req, res, next) => {
  try {
    const { token, userId } = req.body;

    if (!token || !userId) {
      return res.status(400).json({ message: 'Token and userId are required' });
    }

    if (!isValidObjectId(userId)) {
      return res.status(400).json({ message: 'Invalid user ID' });
    }

    const passwordResetToken = await PasswordResetToken.findOne({ owner: userId });
    if (!passwordResetToken) {
      return res.status(403).json({ message: 'Invalid or expired token' });
    }

    const isValid = await passwordResetToken.compareToken(token);
    if (!isValid) {
      return res.status(403).json({ message: 'Invalid or expired token' });
    }

    return next();
  } catch (error) {
    console.error('TOKEN VALIDATION ERROR:', error);
    return res.status(500).json({ message: 'Something went wrong' });
  }
};
