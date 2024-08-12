const fs = require('fs');
const path = require('path');

class Logger {
  constructor(logFilePath) {
    this.logFilePath = logFilePath;
  }

  log(message) {
    const timestamp = new Date().toISOString();
    const formattedMessage = `[${timestamp}] ${message}`;

    // Imprimir en la terminal
    console.log(formattedMessage);

    // Guardar en logs.txt
    fs.appendFileSync(this.logFilePath, `${formattedMessage}\n`, 'utf8');
  }
}

module.exports = Logger;
