import nodemailer from 'nodemailer';
import path from 'path';
import { MAIL_TRAP_PASS, MAIL_TRAP_USER, SIGN_IN_URL } from '#/utils/variables';
import EmailVerificationToken from '#/models/emailVerificationToken';
import { generateTemplate } from '#/mail/template';
import { VERIFY_EMAIL } from '#/utils/variables';
const generateMailTransport = () => {
  const transport = nodemailer.createTransport({
    host: 'sandbox.smtp.mailtrap.io',
    port: 587,
    secure: false,
    auth: {
      user: MAIL_TRAP_USER,
      pass: MAIL_TRAP_PASS,
    },
  });
  return transport;
};
interface Profile {
  name: string;
  email: string;
  userId: string;
}
interface Options {
  email: string;
  link: string;
}  
export const sendVerificationEmail = async (
  token: string,
  profile: Profile
) => {
  const message = `Hello ${profile.name}, welcome to Melo! We're glad to have you on board. Please verify your email to get started.`;
  const transport = generateMailTransport();
  await EmailVerificationToken.create({
    owner: profile.userId,
    token,
  });
  const info = await transport.sendMail({
    from: VERIFY_EMAIL,
    to: profile.email,
    subject: 'Welcome to Melo',
    html: generateTemplate({
      title: 'Welcome to Melo',
      message,
      logo: 'cid:logo',
      banner: 'cid:welcome',
      link: '#',
      btnTitle: token,
    }),
    attachments: [
      {
        filename: 'logo.png',
        path: path.join(__dirname, '../mail/logo.png'),
        cid: 'logo',
      },
      {
        filename: 'welcome.png',
        path: path.join(__dirname, '../mail/welcome.png'),
        cid: 'welcome',
      },
    ],
    text: `Hello ${profile.name}, welcome to Melo! We're glad to have you on board. Your verification token is ${token}`,
  });

  console.log('Mail sent:', info);
};
export const sendForgetPasswordLink = async (
  options:Options
) => {
  const{email, link} = options;
  const message = `Hello  you have requested to reset your password. Please click the link below to reset your password.`;
  const transport = generateMailTransport();
  // await EmailVerificationToken.create({
  //   owner: profile.userId,
  //   token,
  // });
  const info = await transport.sendMail({
    from: VERIFY_EMAIL,
    to: email,
    subject: 'Password reset link',
    html: generateTemplate({
      title: 'Password reset link',
      message,
      logo: 'cid:logo',
      banner: 'cid:forget_password',
      link: link,
      btnTitle: "Reset Password",
    }),
    attachments: [
      {
        filename: 'logo.png',
        path: path.join(__dirname, '../mail/logo.png'),
        cid: 'logo',
      },
      {
        filename: 'forget_password.png',
        path: path.join(__dirname, '../mail/forget_password.png'),
        cid: 'forget_password',
      },
    ],
    text: `Hello, you have requested to reset your password. Please click the link below to reset your password: ${link}`,
  });

  console.log('Mail sent:', info);
};
export const sendPasswordResetSuccessEmail = async (
  name: string,
  email: string,
) => {
  const message =` Hello ${name}, your password has been successfully reset. If you did not initiate this change, please contact our support team immediately.`;
  const transport = generateMailTransport();
  // await EmailVerificationToken.create({
  //   owner: profile.userId,
  //   token,
  // });
  const info = await transport.sendMail({
    from: VERIFY_EMAIL,
    to: email,
    subject: 'Password reset successful',
    html: generateTemplate({
      title: 'Password reset successful',
      message,
      logo: 'cid:logo',
      banner: 'cid:forget_password',
      link: SIGN_IN_URL,
      btnTitle: "Login",
    }),
    attachments: [
      {
        filename: 'logo.png',
        path: path.join(__dirname, '../mail/logo.png'),
        cid: 'logo',
      },
      {
        filename: 'forget_password.png',
        path: path.join(__dirname, '../mail/forget_password.png'),
        cid: 'forget_password',
      },
    ],
    text: `Hello ${name}, your password has been successfully reset. If you did not initiate this change, please contact our support team immediately. Sign in here: ${SIGN_IN_URL}`,
  });

  console.log('Mail sent:', info);
};