const express = require('express');
const router = express.Router();
const quizController = require('../controllers/quizController');

router.post('/', quizController.createQuiz);
router.get('/:id', quizController.getQuizById);
router.post('/:id/answer', quizController.submitAnswer);
router.get('/:id/results', quizController.getResults);

module.exports = router;


