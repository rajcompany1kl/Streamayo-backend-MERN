import dotenv from 'dotenv';
import Joi from 'joi';

dotenv.config();

const schema = Joi.object({
  NODE_ENV: Joi.string().valid('development', 'production').default('development'),
  PORT: Joi.number().default(8080),
  MONGO_URI: Joi.string().uri().required(),
  CLERK_SECRET_KEY: Joi.string().required(),
  CLERK_PUBLISHABLE_KEY: Joi.string().required(),
  CLOUDINARY_URL: Joi.string().optional(),
  CLOUDINARY_API_KEY: Joi.string().optional(),
  CLOUDINARY_API_SECRET: Joi.string().optional(),
  CLOUDINARY_CLOUD_NAME: Joi.string().optional(),
}).unknown();

const { value, error } = schema.validate(process.env);
if (error) {
  console.error('❌ Invalid environment configuration:', error.message);
  process.exit(1);
}

export const env = value;
