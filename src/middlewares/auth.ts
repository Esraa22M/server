import { RequestHandler } from 'express';
import { isValidObjectId } from 'mongoose';
import PasswordResetToken from '#/models/passwordRessetToken';
import { JwtPayload, verify } from 'jsonwebtoken';
import { JWT_SECRET } from '#/utils/variables';
import User from '#/models/users';

export const isValidPasswordResetToken: RequestHandler = async (
  req,
  res,
  next
) => {
  try {
    const { token, userId } = req.body;

    if (!token || !userId) {
      return res.status(400).json({ message: 'Token and userId are required' });
    }

    if (!isValidObjectId(userId)) {
      return res.status(400).json({ message: 'Invalid user ID' });
    }

    const passwordResetToken = await PasswordResetToken.findOne({
      owner: userId,
    });
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

export const mustAuth: RequestHandler = async (req, res, next) => {
  try {
    const authorization = String(req.headers.authorization || '');
    const headerToken = authorization
      .trim()
      .match(/^Bearer\s+(.+)$/i)?.[1]
      ?.trim();
    const queryToken =
      typeof req.query?.token === 'string' ? req.query.token.trim() : '';

    const token = headerToken || queryToken;

    if (!token || token === 'undefined' || token === 'null') {
      return res
        .status(403)
        .json({ error: 'Unauthorized request! Invalid token format' });
    }

    const payload = verify(token, JWT_SECRET as string);
    console.log(payload);

    if (!payload || typeof payload !== 'object' || !('userId' in payload)) {
      return res.status(403).json({ error: 'Invalid token payload!' });
    }

    const id = String((payload as JwtPayload).userId);
    if (!id) return res.status(403).json({ error: 'Invalid token payload!' });

    const user = await User.findOne({ _id: id, tokens: token });
    if (!user) return res.status(403).json({ error: 'Unauthorized request!' });
    req.user = {
      id: user._id,
      name: user.name,
      email: user.email,
      verified: user.verified,
      avatar: user.avatar?.url,
      followers: user.followers.length,
      followings: user.following.length,
    };
    req.token = token
    next();
  } catch (error) {
    console.error('JWT Verification Error:', error);
    return res.status(403).json({ error: 'Invalid or expired token!' });
  }
};

export const isVerified:RequestHandler = async (req, res, next) => {
  if(!req.user?.verified){
    return res.status(403).json({error:"Please verify your email to access this resource!"})
  }
  next();
}