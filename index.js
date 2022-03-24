require('dotenv').config()

const express = require('express');
const app = express();

require('./routes/holdersRoutes')(app);

app.listen(process.env.PORT || 2000, () => {
  console.log('Holders service started');
});
