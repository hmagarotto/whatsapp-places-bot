import { config } from 'dotenv';

config();

export const {
  ZENVIA_API_TOKEN,
  GOOGLE_API_KEY,
  PORT,
} = process.env;
