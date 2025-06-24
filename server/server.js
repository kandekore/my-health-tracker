require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

mongoose.connect(process.env.MONGO_URL);

const app = express();
app.use(cors());
app.use(express.json());

app.use('/api/seizures', require('./routes/seizures'));

app.listen(process.env.PORT, () => console.log('API on', process.env.PORT));
