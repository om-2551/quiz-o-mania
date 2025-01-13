# Quiz-O-Mania App 

## Overview 
This Quiz App provides a RESTful API for creating, managing, and answering quizzes. It includes endpoints for creating quizzes, retrieving quizzes, submitting answers, and retrieving results.

## Setup Instructions 

### Prerequisites
- Node.js and npm installed (for local development)

### Steps to Set Up and Run the Service 
1. **Clone the repository** 
``` 
git clone https://github.com/your-username/quiz-app.git 

cd quiz-o-mania
```

2. **install dependencies** 
npm install

3. **Start the server**
npm start

The server will start on http://localhost:3000.


## Endpoints
- **Create Quiz**: `POST /api/quizzes`
- **Get Quiz**: `GET /api/quizzes/:id`
- **Submit Answer**: `POST /api/quizzes/:id/answer`
- **Get Results**: `GET /api/quizzes/:id/results`


## To test the API endpoints, you can use Postman. Here's how you can test each endpoint:
### Example Requests

#### Create Quiz
```
POST /api/quizzes
{
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
      },
      {
         "id": 2,
         "text": "Which of the following is an example of a Generative AI text model?",
         "options": [
            "ResNet",
            "GPT-3",
            "VGGNet",
            "YOLO"
      ],
      "correct_option": 1
      }
   ]
}
```

#### Get Quiz
```
GET /api/quizzes/1
```

#### Submit Answer
```
POST /api/quizzes/1/answer
{
  "question_id": 1,
  "selected_option": 2
}
```


#### Get Results
```
GET /api/quizzes/1/results
```


4. **Run Unit Test Cases**
```
npm run test:unit
```

5. **Run Integration Test Cases**
```
npm run test:integration
```