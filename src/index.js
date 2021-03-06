// require('dotenv').config();
const express = require('express');
const cors = require('cors');

const { initDatabase } = require('./models/models');

const router = require('./routes/router');

const app = express();

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use(cors({ origin: true, credentials: true }));

app.use('/', router);

app.listen(process.env.PORT, async () => {
  console.log('Server Running on port', process.env.PORT);

  try {
    await initDatabase();
  } catch (error) {
    console.error('Unable to connect to the database:', error);
  }
});
