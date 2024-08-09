const express = require('express');
const dotenv = require('dotenv');

// Configurar dotenv para manejar las variables de entorno
dotenv.config();

const app = express();
const port = process.env.PORT || 3000;

app.get('/', (req, res) => {
  res.send('Hello World!');
});

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}/`);
});
