const chai = require('chai');
const chaiHttp = require('chai-http');
const should = chai.should();
chai.use(chaiHttp);
const { answers } = require('../app/models/answer'); 
const app = require('../app/app')

const quiz = {
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

describe('Quiz API Integration Tests', () => {

    describe('POST /api/quizzes', () => {
        it('should create a new quiz', done => {
            chai.request(app)
                .post('/api/quizzes')
                .send(quiz)
                .end((err, res) => {
                    if (res) {
                        res.should.have.status(201);
                        // chai.expect(res.text).to.be.equal('ok');
                        done();
                    } else {
                        done(err);
                    }
                });
        });

        it('should return 400 if quiz data is invalid', done => { 
            let invalidQuiz = { ...quiz };
            invalidQuiz.title='';
            chai.request(app) 
                .post('/api/quizzes') 
                .send(invalidQuiz) 
                .end((err, res) => { 
                    if (res) {
                        res.should.have.status(400);
                        chai.expect(res.text).to.equal('"title" is not allowed to be empty');
                        done();
                    } else {
                        done(err);
                    }
                    
                }); 
        });

    });


    describe('GET /api/quizzes/:id', () => { 
        it('should get a quiz by ID', (done) => { 
            chai.request(app) .get('/api/quizzes/1') 
                .end((err, res) => { 
                    if (res) {
                        res.should.have.status(200); 
                        chai.expect(res.body).to.have.property('id', quiz.id); 
                        chai.expect(res.body).to.have.property('title', quiz.title); 
                        chai.expect(res.body.questions).to.have.lengthOf(1); 
                        chai.expect(res.body.questions[0]).to.have.property('text', quiz.questions[0].text); 
                        done(); 
                    } else {
                        done(err);
                    } 
                }); 
        });

        it('should return 404 if quiz not found', (done) => { 
            chai.request(app) 
                .get('/api/quizzes/99') 
                .end((err, res) => { 
                    if (res) {
                        res.should.have.status(404); 
                        chai.expect(res.text).to.equal('Quiz not found'); 
                        done(); 
                    } else {
                        done(err);
                    } 
            }); 
        });
    });

    describe('POST /api/quizzes/:id/answer', () => {
        it('should submit an answer and return the result', done => { 
            const answers = { question_id: 1, selected_option: 2 };
            chai.request(app)
                .post('/api/quizzes/1/answer') 
                .send(answers) 
                .end((err, res) => { 
                    if (res) {
                        res.should.have.status(200); 
                        // chai.expect(res.body).to.have.property('is_correct', true); 
                        // chai.expect(res.body.correct_option).to.be.null; 
                        done();
                    }else {
                        done(err);
                    } 
                });

        });

        it('should return 400 if answer data is invalid', (done) => { 
            const answers = { question_id: "1", selected_option: 2 };
            chai.request(app)
                .post('/api/quizzes/1/answer') 
                .send(answers) 
                .end((err, res) => { 
                    if (res) {
                        res.should.have.status(400); 
                        done();
                    } else {
                        done(err);
                    } 
                }); 
        });

        it('should return 404 if quiz not found', (done) => { 
            const answer = { question_id: 1, selected_option: 2 }; 
            chai.request(app) 
                .post('/api/quizzes/99/answer') .
                send(answer) .end((err, res) => { 
                    if (res) {
                        res.should.have.status(404); 
                        chai.expect(res.text).to.equal('Quiz not found'); 
                        done();
                    }else {
                        done(err);
                    } 
                }); 
            });

    })

    describe('GET /api/quizzes/:id/results', () => { 
        it('should get quiz results', done => {
            answers.push({ question_id: 1, selected_option: 2, is_correct: true });
            chai.request(app) 
                .get('/api/quizzes/1/results') 
                .end((err, res) => { 
                    if (res) {
                        res.should.have.status(200); 
                        chai.expect(res.body).to.have.property('quiz_id', 1); 
                        chai.expect(res.body).to.have.property('score', 1); 
                        done();
                    }else {
                        done(err);
                    }
                }); 
        });

        it('should return 404 if quiz not found', done => { 
            chai.request(app) 
                .get('/api/quizzes/99/results') 
                .end((err, res) => { 
                    if (res) {
                        res.should.have.status(404); 
                        chai.expect(res.text).to.equal('Quiz not found'); 
                        done();
                    }else {
                        done(err);
                    }
                }); 
            });
    
    
    });

    

});
