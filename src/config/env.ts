import 'dotenv/config';

export const env = {
  PORT: Number(process.env.PORT),
  MONGO_URI: process.env.MONGO_URI || '',
};
