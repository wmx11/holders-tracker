require('dotenv').config()

const express = require('express');
const app = express();

require('./routes/updaterRoutes')(app);

app.listen(process.env.PORT_UPDATER || 3000, () => {
  console.log('Updater service started');
});
