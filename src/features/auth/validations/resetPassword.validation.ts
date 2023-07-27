import Joi, { ObjectSchema, StringSchema } from 'joi';

const emailSchema: StringSchema = Joi.string().required().email().messages({
  'string.base': 'Email must be of type string',
  'string.email': 'Invalid Email',
  'string.empty': 'Email is a required field'
});

const signinValidation: ObjectSchema = Joi.object().keys({
  password: Joi.string().required().min(4).max(8).messages({
    'string.base': 'Password must be of type string',
    'string.min': 'Invalid password',
    'string.max': 'Invalid password',
    'string.empty': 'Password is a required field'
  }),
  confirmedPassword: Joi.string().required().valid(Joi.ref('password')).messages({
    'string.base': 'Password must be of type string',
    'string.min': 'Invalid password',
    'string.max': 'Invalid password',
    'string.empty': 'Password is a required field'
  })
});

export { signinValidation, emailSchema };
