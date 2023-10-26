const express = require('express');
const app = express();
const port = 3000; // Choose a port number
const cors = require('cors');
app.get('/', (req, res) => {
  res.send('Hello, Worlsssssd!');
});
const corsOptions = {
    origin: '*', 
  };
  
  app.use(cors(corsOptions));
  

function numberToWords(number) {
    const words = ['zero', 'one', 'two', 'three', 'four', 'five', 'six', 'seven', 'eight', 'nine'];
    const numStr = number.toString();
    const result = numStr
      .split('')
      .map(digit => words[parseInt(digit)])
      .join(' ');
  
    return result;
  }
  
  app.get('/convert', (req, res) => {
    const numbers = req.query.numbers;
  
    if (!numbers) {
      return res.status(400).json({ error: 'Missing "numbers" query parameter' });
    }
  
    const textArray = numberToWords(numbers);
  
    res.json({ convertedText: textArray });
  });
  
  
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
