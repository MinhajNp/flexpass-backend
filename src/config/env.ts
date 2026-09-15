import 'dotenv/config';

const secret = process.env.JWT_SECRET;
const refresh_secret = process.env.JWT_REFRESH_SECRET;
if (!secret) {
  throw new Error('JWT_SECRET is not defined');
}

if (!refresh_secret) {
  throw new Error('JWT_REFRESH_SECRET is not defined');
}
export const env = {
  PORT: Number(process.env.PORT),
  MONGO_URI: process.env.MONGO_URI || '',
  JWT_SECRET: secret,
  JWT_REFRESH_SECRET: refresh_secret,
  NODE_ENV: process.env.NODE_ENV,
  SMTP_HOST: process.env.SMTP_HOST,
  SMTP_PORT: process.env.SMTP_PORT,
  SMTP_USER: process.env.SMTP_USER,
  SMTP_PASSWORD: process.env.SMTP_PASSWORD,
  SMTP_FROM: process.env.SMTP_FROM,
};
