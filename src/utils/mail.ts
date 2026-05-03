import nodemailer from 'nodemailer';
import path from 'path';
import { MAIL_TRAP_PASS, MAIL_TRAP_USER } from '#/utils/variables';
import EmailVerificationToken from '#/models/emailVerificationToken';
import { generateTemplate } from '#/mail/template';
import { VERIFY_EMAIL } from '#/utils/variables';
const message = `Hello ${name}, welcome to Melo! We're glad to have you on board. Please verify your email to get started.`;
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
export const sendVerificationEmail = async (token: string , profile:Profile) => {
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
  text: `Hello ${name}, welcome to Melo! We're glad to have you on board. Your verification token is ${token}`,
});

console.log('Mail sent:', info);
};


