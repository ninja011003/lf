// Import necessary modules
const express = require('express');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = 3000;

// Middleware to parse incoming request body
app.use(express.urlencoded({ extended: true }));

// List of questions
const questions = [
    "How often do you think about the other person?",
    "Do you feel excited when you see or talk to them?",
    "When you're not around them, do you miss them?",
    "Would you make sacrifices for the other person’s happiness?",
    "Do you feel comfortable sharing your deepest thoughts and feelings with them?",
    "How much do you care about their well-being?",
    "Do you imagine a future with this person?",
    "Do you feel like they are a part of your life?",
    "If they propose you tonight, would you accept?",
    "If you had to kill the other person, what would the reason be?"
];

// Serve the form to the user
app.get('/:number', (req, res) => {
  const questionNumber = req.params.number;
  res.send(`<!DOCTYPE html>
  <html>
  <head>
    <title>Questionnaire</title>
    <style>
      body {
        font-family: Arial, sans-serif;
        margin: 0;
        padding: 0;
        background-color: #eaf7ff; /* Light blue background */
        display: flex;
        justify-content: center;
        align-items: center;
        height: 100vh;
      }
      .container {
        background: #ffffff;
        padding: 30px;
        border-radius: 12px;
        box-shadow: 0 6px 12px rgba(0, 0, 0, 0.1);
        width: 100%;
        max-width: 450px;
        text-align: center;
      }
      h1 {
        color: #007bff;
        font-size: 28px;
        margin-bottom: 20px;
      }
      .question {
        font-size: 18px;
        margin-bottom: 20px;
        color: #333;
      }
      input[type="text"] {
        width: 100%;
        padding: 12px;
        margin-bottom: 25px;
        border: 1px solid #007bff;
        border-radius: 6px;
        background-color: #f0f9ff;
        color: #333;
      }
      input[type="text"]:focus {
        outline: none;
        border-color: #0056b3;
        background-color: #ffffff;
      }
      button {
        padding: 12px 24px;
        background-color: #007bff;
        color: white;
        border: none;
        border-radius: 6px;
        cursor: pointer;
        font-size: 16px;
      }
      button:hover {
        background-color: #0056b3;
      }
      button:active {
        background-color: #004080;
      }
      footer {
        margin-top: 20px;
        color: #666;
        font-size: 14px;
      }
    </style>
  </head>
  <body>
    <div class="container">
      <h1>L-or-F Finder:${questionNumber}</h1>
      <div id="questionnaire">
        <p class="question" id="question">${questions[0]}</p>
        <input type="text" id="answer" placeholder="Type your answer here..." required>
        <button id="next">Next</button>
      </div>
      <footer>Love Questionnaire - 2024</footer>
    </div>
    <script>
      const questions = ${JSON.stringify(questions)};
      let currentQuestion = 0;
      const answers = [];

      document.getElementById('next').addEventListener('click', () => {
        const answerInput = document.getElementById('answer');
        const answer = answerInput.value.trim();

        if (!answer) {
          alert('Please provide an answer.');
          return;
        }

        answers.push(answer);
        answerInput.value = '';

        currentQuestion++;

        if (currentQuestion < questions.length) {
          document.getElementById('question').textContent = questions[currentQuestion];
        } else {
          fetch('/submit', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ answers })
          }).then(response => response.text())
            .then(message => {
              document.getElementById('questionnaire').innerHTML = '<h2>Love: 82%<br>Friendship: 18%</h2>';
            }).catch(error => {
              console.error('Error:', error);
              alert('An error occurred while submitting your answers.');
            });
        }
      });
    </script>
  </body>
  </html>`);
});

// Handle form submission
app.post('/submit', (req, res) => {
  let body = '';

  req.on('data', chunk => {
    body += chunk.toString();
  });

  req.on('end', () => {
    const { answers } = JSON.parse(body);
    const filePath = path.join(__dirname, 'ans.txt');

    const fileContent = answers.map((answer, index) => `${questions[index]}: ${answer}`).join('\n');

    fs.writeFile(filePath, fileContent, (err) => {
      if (err) {
        console.error('Error writing file:', err);
        return res.status(500).send('An error occurred while saving your answers.');
      }

      res.send('Thank you! Your answers have been saved.');
    });
  });
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
