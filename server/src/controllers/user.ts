import { RequestHandler } from 'express';
import { CreateUserRequest, VerifyEmailRequest } from '#/@types/user';
import jwt from 'jsonwebtoken';
import User from '#/models/users';
import { generateToken } from '#/utils/helper';
import {
  sendForgetPasswordLink,
  sendPasswordResetSuccessEmail,
  sendVerificationEmail,
} from '#/utils/mail';
import emailVerificationToken from '#/models/emailVerificationToken';
import { isValidObjectId } from 'mongoose';
import PasswordResetToken from '#/models/passwordRessetToken';
import crypto from 'crypto';
import { JWT_SECRET, PASSWORD_RESET_LINK } from '#/utils/variables';
// 1. إنشاء مستخدم جديد وإرسال التوكن
export const create: RequestHandler = async (req: CreateUserRequest, res) => {
  try {
    const { name, email, password } = req.body;

    // إنشاء المستخدم
    const user = await User.create({ name, email, password });

    // توليد التوكن وحفظه في قاعدة البيانات (تم الإصلاح هنا)
    const token = generateToken();
    await emailVerificationToken.create({
      owner: user._id,
      token,
    });

    // إرسال البريد الإلكتروني
    await sendVerificationEmail(token, {
      name,
      email,
      userId: user._id.toString(),
    });

    res.status(201).json({
      user: { id: user._id, name: user.name, email: user.email },
      message: 'User created and mail sent',
    });
  } catch (error) {
    console.error('MAIL ERROR:', error);
    res.status(500).json({ message: 'Something went wrong' });
  }
};

// 2. التحقق من كود تفعيل البريد الإلكتروني
export const verifyEmail: RequestHandler = async (
  req: VerifyEmailRequest,
  res
) => {
  try {
    const { token, userId } = req.body;

    if (!isValidObjectId(userId)) {
      return res.status(400).json({ message: 'Invalid user ID' });
    }

    const verificationToken = await emailVerificationToken.findOne({
      owner: userId,
    });

    if (!verificationToken) {
      return res.status(400).json({ message: 'Invalid or expired token' });
    }

    // التحقق من مطابقة التوكن المشفر
    const matched = await verificationToken.compareToken(token);
    if (!matched) {
      return res.status(400).json({ message: 'Invalid or expired token' });
    }

    // تحديث حالة المستخدم وحذف التوكن المستهلك
    await User.findByIdAndUpdate(userId, { verified: true });
    await emailVerificationToken.findByIdAndDelete(verificationToken._id);

    res.json({ message: 'Email verified successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Something went wrong' });
  }
};

// 3. إعادة إرسال توكن تحقق جديد
export const sendVerificationToken: RequestHandler = async (req, res) => {
  try {
    const { userId } = req.body;

    // التحقق أولاً من صحة المعرف (تم الإصلاح هنا)
    if (!isValidObjectId(userId)) {
      return res.status(400).json({ message: 'Invalid user ID' });
    }

    // التأكد من وجود المستخدم (تم الإصلاح باستخدام async/await لتجنب مشاكل النطاق)
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // حذف أي توكن قديم لهذا المستخدم
    await emailVerificationToken.findOneAndDelete({ owner: userId });

    // توليد التوكن الجديد وحفظه
    const token = generateToken();
    await emailVerificationToken.create({ owner: userId, token });

    // إرسال البريد الإلكتروني بنجاح
    await sendVerificationEmail(token, {
      name: user.name,
      email: user.email,
      userId: user._id.toString(),
    });

    res.json({ message: 'Verification token sent' });
  } catch (error) {
    console.error('RESEND ERROR:', error);
    res.status(500).json({ message: 'Something went wrong' });
  }
};
export const generateForgetpasswordLink: RequestHandler = async (req, res) => {
  try {
    const { email } = req.body;
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: 'Account not found' });
    }

    const token = crypto.randomBytes(36).toString('hex');

    // حذف أي توكن قديم لهذا المستخدم قبل إنشاء واحد جديد
    await PasswordResetToken.findOneAndDelete({ owner: user._id });

    await PasswordResetToken.create({
      owner: user._id,
      token,
    });

    const resetLink = `${PASSWORD_RESET_LINK}?token=${token}&userId=${user._id}`;
    sendForgetPasswordLink({ email: user.email, link: resetLink });
    res
      .status(200)
      .json({ message: 'check your email for the reset link', resetLink });
  } catch (error) {
    console.error('PASSWORD RESET ERROR:', error);
    res.status(500).json({ message: 'Something went wrong' });
  }
};
export const grantValid: RequestHandler = async (req, res) => {
  res.json({ valid: true });
};
export const updatePassword: RequestHandler = async (req, res) => {
  // Implementation for updating password
  const { userId, password } = req.body;
  const user = await User.findById(userId);
  if (!user) {
    return res.status(403).json({ message: 'unautharized access' });
  }
  const matched = await user.comparePassword(password);
  if (matched) {
    return res
      .status(422)
      .json({ message: 'New password cannot be the same as the old password' });
  }
  user.password = password;
  await user.save();
  await PasswordResetToken.findOneAndDelete({ owner: userId });
  sendPasswordResetSuccessEmail(user.name, user.email);
  res.status(200).json({ message: 'Password updated successfully' });
};
export const SignIn: RequestHandler = async (req, res) => {
  const { password, email } = req.body;
  const user = await User.findOne({ email });
  if (!user)
    return res.json(403).json({ error: 'Email or password does not match!' });
  // compare the password
  const matched = await user.comparePassword(password);
  if (!matched)
    return res.json(403).json({ error: 'Email or password does not match!' });
  // generate the token
  const token = jwt.sign({ userId: user?.id || '' }, JWT_SECRET!);
  user.tokens.push(token);
  await user.save();
  res.json({
    profile: {
      id: user._id,
      name: user.name,
      email: user.email,
      verified: user.verified,
      avatar: user.avatar?.url,
      followers: user.followers.length,
      followings:user.following.length,
      
    },
    token
  });
};
