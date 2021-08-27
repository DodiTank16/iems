const express = require('express');
const connectDB = require('./config/db');

const app = express();

// Connect MongoDB
connectDB();

// Init middleware
app.use(express.json({ extended: false }));

app.get('/', (req, res) => res.send('Api Stated..'));

// Define routes
app.use('/api/users', require('./routes/api/users'));
app.use('/api/auth', require('./routes/api/auth'));

const PORT = process.env.PORT || 5500;

app.listen(PORT, () => console.log(`Server started at port ${PORT}...`));
