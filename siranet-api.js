const dotenv = require('dotenv');
const axios = require('axios');

// Configurar dotenv para manejar las variables de entorno
dotenv.config();

const apiUrl = process.env.MERCADOLIBRE_API_URL;
const accessToken = process.env.ACCESS_TOKEN;

const siranetAPI = {
  async getPublicaciones() {
    try {
      const response = await axios.get(`https://api.mercadolibre.com/sites/MLA/search?seller_id=282227241`, {
        headers: {
          Authorization: `Bearer ${accessToken}`
        }
      });
      return response.data.results;
    } catch (error) {
      console.error('Error fetching publicaciones:', error);
      throw error;
    }
  },
  async request(command) {
    const [baseCommand, labelsString] = command.split('.');
    if (baseCommand === 'publicaciones') {
      let publicaciones = await this.getPublicaciones();

      // Handle multiple label extraction if specified
      if (labelsString && labelsString.startsWith('{') && labelsString.endsWith('}')) {
        const labels = labelsString.slice(1, -1).split(',');
        publicaciones = publicaciones.map(pub => {
          const filtered = {};
          labels.forEach(label => {
            filtered[label.trim()] = pub[label.trim()];
          });
          return filtered;
        });
      }

      return publicaciones;
    } else {
      throw new Error('Unknown command');
    }
  }
};

module.exports = siranetAPI;
