 
const express = require('express');
const cors = require('cors');
const bcrypt = require('bcryptjs');

const app = express();
const port = 3002;

app.use(cors());
app.use(express.json());

let users = [
  { id: 1, username: 'admin', password: bcrypt.hashSync('1234', 8) }  // Store hashed passwords
];
// Mock data
const data = {
  lineChart: [
    { month: 'Jan', value: 50 },
    { month: 'Feb', value: 40 },
    { month: 'Mar', value: 35 },
    { month:'Apr',value:70},
    { month: 'May', value: 55 },

    // Add more data
  ],
  barChart: [
    { category: 'A', value: 100 },
    { category: 'B', value: 200 },
    { category: 'C', value: 150 },
    { category: 'D', value: 450 },
    { category: 'E', value: 50 },

    // Add more data
  ],
  pieChart: [
    { segment: 'Segment 1', value: 30 },
    { segment: 'Segment 2', value: 20 },
    { segment: 'Segment 3', value: 50 },
    // Add more data
  ]
};

 
app.post('/api/login', (req, res) => {
  const { username, password } = req.body;
  const user = users.find(u => u.username === username);
  
  if (!user || !bcrypt.compareSync(password, user.password)) {
    return res.status(401).send('Invalid credentials');
  }
  
  res.send('Login successful');
});

 
app.get('/api/data', (req, res) => {
  res.json(data);
});

app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
