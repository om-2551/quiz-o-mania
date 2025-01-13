const Joi = require('joi');

const answerSchema = Joi.object({
  user_id: Joi.number().integer().options({ convert: false }).required(),
  question_id: Joi.number().integer().options({ convert: false }).required(),
  selected_option: Joi.number().integer().min(0).max(3).required().strict()
});

module.exports = answerSchema;
