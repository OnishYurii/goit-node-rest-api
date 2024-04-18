import Joi from "joi";

export const createContactSchema = Joi.object({
  name: Joi.string().required().messages({
    "any.required": "Name is required",
  }),
  phone: Joi.string().required().messages({
    "any.required": "Phone number is required",
  }),
  email: Joi.string().email().required().messages({
    "string.email": "Email is invalid",
    "any.required": "Email is required",
  }),
  favorite: Joi.boolean().optional(),
});

export const updateContactSchema = Joi.object({
  name: Joi.string().optional(),
  email: Joi.string().email().optional().messages({
    "string.email": "Email is invalid",
  }),
  phone: Joi.string().optional(),
  favorite: Joi.boolean().optional(),
});

export const updateFavoriteSchema = Joi.object({
  favorite: Joi.boolean().required(),
});
