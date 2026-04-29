import { RequestHandler } from 'express';
import nodemailer from 'nodemailer';
import { CreateUserRequest } from '#/@types/user';
import User from '#/models/users';
import { MAIL_TRAP_PASS, MAIL_TRAP_USER } from '#/utils/variables';
import { generateToken } from '#/utils/helper';
import EmailVerificationToken from '#/models/emailVerificationToken';
export const create: RequestHandler = async (req: CreateUserRequest, res) => {
  try {
    const { name, email, password } = req.body;

    const user = await User.create({ name, email, password });

    const transport = nodemailer.createTransport({
      host: 'sandbox.smtp.mailtrap.io',
      port: 587,
      secure: false,
      auth: {
        user: MAIL_TRAP_USER,
        pass: MAIL_TRAP_PASS,
      },
    });
    const token = generateToken();
   await EmailVerificationToken.create({
      owner: user._id,
      token,
    });
    const info = await transport.sendMail({
      from: 'auth@melo.com',
      to: user.email,
      subject: 'Welcome to Melo',
      text: `Hello ${name}, welcome to Melo! We're glad to have you on board.your verification token is ${token}`,
    });

    console.log('Mail sent:', info);

    res.status(201).json({ user, message: 'User created and mail sent' });
  } catch (error) {
    console.error('MAIL ERROR:', error);
    res.status(500).json({ message: 'Something went wrong' });
  }
};
