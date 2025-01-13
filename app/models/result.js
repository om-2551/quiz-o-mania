const results = [];

const Result = {
  quiz_id: Number,
  user_id: Number,
  score: Number,
  answers: [
    {
      question_id: Number,
      selected_option: Number,
      is_correct: Boolean
    }
  ]
};

module.exports = { results, Result };
