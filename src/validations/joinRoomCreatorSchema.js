import Joi from 'joi';

export const joinRoomCreatorSchema = Joi.object({
  roomId: Joi.string().required(),
  userId: Joi.string().required(),
  userImageUrl: Joi.string().uri().required(),
  userName: Joi.string().required(),
  title: Joi.string().required(),
  description: Joi.string().required(),
  thumbnailUrl: Joi.string().uri().required(),
});