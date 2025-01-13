const quizzes = [];

const Quiz = {
  id: Number,
  title: String,
  questions: [
    {
      id: Number,
      text: String,
      options: [String],
      correct_option: Number
    }
  ]
};

module.exports = { quizzes, Quiz };
