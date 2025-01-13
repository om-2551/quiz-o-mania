const Joi = require('joi');

const questionSchema = Joi.object({
  id: Joi.number().integer().options({ convert: false }).required(),
  text: Joi.string().required(),
  options: Joi.array().items(Joi.string()).length(4).required(),
  correct_option: Joi.number().integer().min(0).max(3).required()
});

const quizSchema = Joi.object({
  id: Joi.number().integer().options({ convert: false }).required(),
  title: Joi.string().required(),
  questions: Joi.array().items(questionSchema).required()
});

module.exports = quizSchema;
