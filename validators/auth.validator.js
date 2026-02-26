import Joi from "joi";

export const sendOtpSchema = Joi.object({
  mobile: Joi.string().length(10).required(),
  role: Joi.string().valid("user", "restaurant", "admin","delivery").required(),
});

export const verifyOtpSchema = Joi.object({
  mobile: Joi.string().length(10).required(),
  role: Joi.string().valid("user", "restaurant", "admin","delivery").required(),
  otp: Joi.string().length(6).required(),
});