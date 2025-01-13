const { quizzes } = require('../models/quiz');
const { answers } = require('../models/answer');
const quizSchema = require('../schemas/quizValidator')
const answerSchema = require('../schemas/answerValidator');

exports.createQuiz = async (req, res) => {
  try {
    const { error } = quizSchema.validate(req.body); 
    if (error) return res.status(400).send(error.details[0].message);
  
    const quiz = {
      id: quizzes.length + 1,
      title: req.body.title,
      questions: req.body.questions,
    };
    quizzes.push(quiz);
    res.status(201).json(quiz);
  } catch (error) {
    res.status(500).send('Internal Server Error');
  }

};

exports.getQuizById = async (req, res) => {
  try {
    const quiz = quizzes.find(q => q.id == req.params.id);
    if (!quiz) return res.status(404).send('Quiz not found');
  
    const quizWithoutAnswers = {
      id: quiz.id,
      title: quiz.title,
      questions: quiz.questions.map(q => ({
        id: q.id,
        text: q.text,
        options: q.options,
      })),
    };
    res.status(200).json(quizWithoutAnswers);
  } catch (error) {
    res.status(500).send('Internal Server Error');
  }

};

exports.submitAnswer = async (req, res) => {
  try {
    const { error } = answerSchema.validate(req.body); 
    if (error) return res.status(400).send(error.details[0].message);

    const quiz = quizzes.find(q => q.id == req.params.id);
    if (!quiz) return res.status(404).send('Quiz not found');
    
    const question = quiz.questions.find(q => q.id == req.body.question_id);
    if (!question) return res.status(404).send('Question not found');
    
    const isCorrect = question.correct_option === req.body.selected_option;
    const answer = {
      question_id: req.body.question_id,
      selected_option: req.body.selected_option,
      is_correct: isCorrect,
    };
    answers.push(answer);

    res.status(200).json({
      is_correct: isCorrect,
      correct_option: isCorrect ? null : question.correct_option,
    });
  } catch (error) {
    res.status(500).send('Internal Server Error');
  }
  
};

exports.getResults = async (req, res) => {
  try {
    const quiz = quizzes.find(q => q.id == req.params.id);
    if (!quiz) return res.status(404).send('Quiz not found');
    
    const userAnswers = answers.filter(a => quiz.questions.some(q => q.id === a.question_id));
    const score = userAnswers.filter(a => a.is_correct).length;
    
    res.status(200).json({
      quiz_id: quiz.id,
      score: score,
      answers: userAnswers,
    });
  } catch (error) {
    res.status(500).send('Internal Server Error');
  }

};
