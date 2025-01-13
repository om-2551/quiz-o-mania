const expect = require("expect.js");
const sinon = require('sinon'); 
const { mockRequest, mockResponse } = require('mock-req-res');
const { createQuiz, getQuizById, submitAnswer, getResults } = require('../app/controllers/quizController'); 
const { quizzes } = require('../app/models/quiz'); 
const { answers } = require('../app/models/answer'); 
const quizSchema = require('../app/schemas/quizValidator');
const answerSchema = require('../app/schemas/answerValidator');

const reqBody = {
   "id": 1,
   "title": "Introduction to Generative AI",
   "questions": [
      {
         "id": 1,
         "text": "What is the primary purpose of Generative AI?",
         "options": [
            "To analyze existing data", 
            "To generate new data", 
            "To classify images", 
            "To sort emails"
            ],
         "correct_option": 1
      }
   ]
};

describe('Quiz Controller CreateQuiz API Unit Tests', ()=>{
   
    it('should create new quiz',async ()=>{
      const req = mockRequest({ path: '/api/quizzes/', body: reqBody });
      const res = mockResponse();
      await createQuiz(req, res); 
      expect(res.status.calledWith(201)).to.be.equal(true);
      expect(res.json.calledOnce).to.be.true;
      expect(quizzes).to.have.length(1);
    });
    it('should return 400 if any data in quiz is invalid', async () => { 
      const req = mockRequest({ path: '/api/quizzes/', body: reqBody });
      const res = mockResponse();
      req.body.title = "";
      await createQuiz(req, res); 
      expect(res.status.calledWith(400)).to.be(true); 
      expect(res.send.calledOnce).to.be(true); 
   });
   it('should handle internal server error', async () => { 
      const req = mockRequest({ path: '/api/quizzes/', body: reqBody });
      const res = mockResponse();
      const validateStub = sinon.stub(quizSchema, 'validate').throws(new Error('some error')); 
      await createQuiz(req, res); 
      expect(res.status.calledWith(500)).to.be(true); 
      expect(res.send.calledOnce).to.be(true);
      validateStub.restore(); // Restore the original function 
   });
})

describe('Quiz Controller getQuizById API Unit Tests', ()=>{


   it('should get a quiz by ID', async () => { 
      const req = mockRequest({ path: '/api/quizzes/:id', body: reqBody });
      const res = mockResponse();
      req.params.id = 1; 
      await getQuizById(req, res); 
      expect(res.status.calledWith(200)).to.be(true); 
      expect(res.json.calledOnce).to.be(true); 
      expect(res.json.firstCall.args[0]).to.have.property("id", 1); 
      expect(res.json.firstCall.args[0]).to.have.property("title", "Introduction to Generative AI"); 
      expect(res.json.firstCall.args[0].questions).to.have.length(1); 
      expect(res.json.firstCall.args[0].questions[0]).to.have.property("text", "What is the primary purpose of Generative AI?"); 
   });

   it('should return 404 if quiz not found', async () => { 
      const req = mockRequest({ path: '/api/quizzes/:id', body: reqBody });
      const res = mockResponse();
      req.params.id = 99; 
      await getQuizById(req, res); 
      expect(res.status.calledWith(404)).to.be(true); 
      expect(res.send.calledOnce).to.be(true);
   });

   it('should handle internal server error', async () => { 
      const req = mockRequest({ path: '/api/quizzes/:id', body: reqBody });
      const res = mockResponse();
      const findStub = sinon.stub(quizzes, 'find').throws(new Error('some error')); 
      req.params.id = 1; 
      await getQuizById(req, res); 
      expect(res.status.calledWith(500)).to.be(true); 
      expect(res.send.calledOnce).to.be(true); 
      findStub.restore(); // Restore the original function 
   });

})

describe('Quiz Controller submitAnswer API Unit Tests', async ()=>{

   it('should return 404 if quiz not found', async () => { 
      const req = mockRequest({ path: '/api/quizzes/:id/answer', body: reqBody });
      const res = mockResponse();
      req.params.id = 99; 
      req.body={ user_id: 1, question_id: 1, selected_option: 1 }
      await submitAnswer(req, res); 
      expect(res.status.calledWith(404)).to.be(true); 
      expect(res.send.calledOnce).to.be(true);
   });

   it('should submit internal server', async () => {
      const req = mockRequest({ path: '/api/quizzes/:id/answer', body: reqBody });
      const res = mockResponse();
      req.params.id = 1;
      req.body = { question_id: 1, selected_option: 2 };
      const validateStub = sinon.stub(answerSchema, 'validate').throws(new Error('some error')); 
      await submitAnswer(req, res);
      console.log('res.status.calledWith',res.status.calledWith)
      expect(res.status.calledWith(500)).to.be(true); 
      validateStub.restore()

   });

   it('should return 400 if answer data is invalid', async () => { 
      const req = mockRequest({ path: '/api/quizzes/:id/answer', body: reqBody });
      const res = mockResponse();
      req.params.id = 1;
      req.body = { question_id: 1, selected_option: 2 }; 
      const validateStub = sinon.stub(answerSchema, 'validate').returns({ error: { details: [{ message: 'Invalid data' }] } }); 
      await submitAnswer(req, res); 
      expect(res.status.calledWith(400)).to.be(true); 
      expect(res.send.calledOnce).to.be(true); 
      validateStub.restore();
   });

});

describe('Quiz Controller getResults API Unit Tests', async ()=>{

   it('should submit an answer and return the result', async () => {
      const req = mockRequest({ path: '/api/quizzes/:id/results/:user_id', body: reqBody });
      const res = mockResponse();
      req.params.id = 1;
      req.params.user_id = 1;
      req.body = { user_id: 1, question_id: 1, selected_option: 1}
      await submitAnswer(req, res);
      expect(res.status.calledWith(200)).to.be(true); 
      expect(res.json.calledOnce).to.be(true); 
      expect(res.json.firstCall.args[0]).to.have.property("is_correct", true); 

   });

   it('should get quiz results', async () => { 
      const req = mockRequest({ path: '/api/quizzes/:id/results', body: reqBody });
      const res = mockResponse();
      req.params.id = 1;
      req.params.user_id = 1;
      let answers = [];
      answers.push({ question_id: 1, selected_option: 2, is_correct: true }); 
      answers.push({ question_id: 1, selected_option: 1, is_correct: true });
      answers.push({ question_id: 1, selected_option: 1, is_correct: false });
      await getResults(req, res); 
      expect(res.status.calledWith(200)).to.be(true); 
      expect(res.json.calledOnce).to.be(true); 
      expect(res.json.firstCall.args[0]).to.have.property("quiz_id", 1); 
   });

   it('should return 404 if quiz not found when getting results', async () => {
      const req = mockRequest({ path: '/api/quizzes/:id/results', body: reqBody });
      const res = mockResponse();
      req.params.id = 99; 
      await getResults(req, res); 
      expect(res.status.calledWith(404)).to.be(true); 
      expect(res.send.calledOnce).to.be(true); 
   });

   it('should handle internal server error when getting results', async () => { 
      const req = mockRequest({ path: '/api/quizzes/:id/results', body: reqBody });
      const res = mockResponse();
      const findStub = sinon.stub(quizzes, 'find').throws(new Error('some error')); 
      req.params.id = 1; 
      await getResults(req, res); 
      expect(res.status.calledWith(500)).to.be(true); 
      expect(res.send.calledOnce).to.be(true); 
      findStub.restore();
      });
});