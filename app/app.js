const express = require('express');
const bodyParser = require('body-parser');
const quizRoutes = require('./routes/route');

const app = express();
const port = 3001;

app.use(bodyParser.json());
app.use(express.json());

app.use('/api/quizzes', quizRoutes);

app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});
module.exports = app; // Export the app instance