const express = require('express');
const dotenv = require('dotenv');
const Logger = require('./Logger');
const MercadoLibreAPI = require('./mercadoLibreAPI');

const configPath = './config/config.yaml';
const endpointsPath = './endpoints.yaml';
const logFilePath = './logs.txt';

// Configurar dotenv para manejar las variables de entorno
dotenv.config();

const logger = new Logger(logFilePath);

const app = express();
const port = process.env.PORT || 3000;

app.get('/', async (req, res) => {
  try {
    const mercadoLibreAPI = new MercadoLibreAPI(configPath, endpointsPath);
    // Ejemplo: Obtener los datos del usuario
    const userData = await mercadoLibreAPI.request('GET', 'USER', 'addresses');
    
    res.json(userData);
  } catch (error) {
    res.status(500).send('Error retrieving user data');
    logger.log('GET / - Error: ' + error.message);
  }
});

app.listen(port, () => {
  logger.log(`Server running at http://localhost:${port}/`);
});
