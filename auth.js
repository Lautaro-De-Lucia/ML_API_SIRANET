const axios = require('axios');

class AuthManager {
  constructor(configManager, logger) {
    this.configManager = configManager;
    this.logger = logger;
  }

  async refreshToken() {
    const authConfig = this.configManager.getAuthConfig();

    const data = new URLSearchParams({
      grant_type: 'refresh_token',
      client_id: authConfig.APP_ID,
      client_secret: authConfig.CLIENT_SECRET,
      refresh_token: authConfig.REFRESH_TOKEN,
    });

    try {
      const response = await axios.post('https://api.mercadolibre.com/oauth/token', data, {
        headers: {
          'accept': 'application/json',
          'content-type': 'application/x-www-form-urlencoded',
        },
      });

      const { access_token, refresh_token, expires_in } = response.data;
      this.logger.log('Token refreshed successfully');
      
      // Calcular y guardar el tiempo de expiración del token
      const tokenExpirationTime = Math.floor(Date.now() / 1000) + expires_in;
      this.configManager.updateTokens(access_token, refresh_token, tokenExpirationTime);

    } catch (error) {
      this.logger.log('Failed to refresh token: ' + error.message);
      throw error;
    }
  }
}

module.exports = AuthManager;
