import nodemailer from 'nodemailer';
import { env } from '@/lib/utils/env';

export async function sendConfirmEmail(to: string, token: string) {
  const transporter = nodemailer.createTransport({
    host: env.smtpHost,
    port: env.smtpPort,
    secure: false,
    auth: env.smtpUser ? { user: env.smtpUser, pass: env.smtpPass } : undefined
  });

  const link = `${env.baseUrl}/api/confirm?token=${token}`;
  await transporter.sendMail({
    from: env.fromEmail,
    to,
    subject: 'Confirm your ReligiousLiberty.TV Reader subscription',
    text: `Click to confirm: ${link}`
  });
}
