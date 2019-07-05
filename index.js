const express = require('express');
const app = express();

require('dotenv').config();

const port = process.env.PORT || 3001;

app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});

require('./src/routes/data')(app);

app.listen(port, () => {
  console.log(`Server up on ${port}`);
});

module.exports = { app };
