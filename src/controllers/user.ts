import { RequestHandler } from 'express';
import { CreateUserRequest } from '#/@types/user';
import User from '#/models/users';
import { generateToken } from '#/utils/helper';
import { sendVerificationEmail } from '#/utils/mail';

export const create: RequestHandler = async (req: CreateUserRequest, res) => {
  try {
    const { name, email, password } = req.body;

    const user = await User.create({ name, email, password });
    const token = generateToken();
    await sendVerificationEmail(token, {
      name,
      email,
      userId: user._id.toString(),
    });

    res.status(201).json({
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
      },
      message: 'User created and mail sent',
    });
  } catch (error) {
    console.error('MAIL ERROR:', error);
    res.status(500).json({
      message: 'Something went wrong',
    });
  }
};