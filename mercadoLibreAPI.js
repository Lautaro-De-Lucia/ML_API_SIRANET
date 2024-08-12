const axios = require('axios');
const fs = require('fs');
const yaml = require('js-yaml');
const ConfigManager = require('./configManager');
const AuthManager = require('./auth');
const Logger = require('./Logger');


const logFilePath = './logs.txt';
const logger = new Logger(logFilePath);


class MercadoLibreAPI {
    constructor(configPath, endpointsPath) {
        logger.log('Creating MercadoLibreAPI instance');
        this.configManager = new ConfigManager(configPath, logger);
        logger.log('ConfigManager created');
        this.authManager = new AuthManager(this.configManager, logger);
        logger.log('AuthManager created');
        this.endpoints = this.loadEndpoints(endpointsPath);
        logger.log('Endpoints loaded');
        this.apiUrl = 'https://api.mercadolibre.com';
    }
  
    loadEndpoints(endpointsPath) {
      try {
        const fileContents = fs.readFileSync(endpointsPath, 'utf8');
        logger.log(`Loaded endpoints from ${endpointsPath}`);
        return yaml.load(fileContents);
      } catch (error) {
        logger.log('Failed to load endpoints file: ' + error.message);
        throw error;
      }
    }
  
    replaceConstants(endpoint) {
      const authConfig = this.configManager.getAuthConfig();
      return endpoint
        .replace('$USER_ID', authConfig.USER_ID)
        .replace('$APP_ID', authConfig.APP_ID)
        .replace('$APPLICATION_ID', authConfig.APP_ID); // Assuming APP_ID and APPLICATION_ID are the same
    }
  
    isTokenExpired() {
      const authConfig = this.configManager.getAuthConfig();
      const tokenExpirationTime = authConfig.token_expiration_time || 0;
      const currentTime = Math.floor(Date.now() / 1000);
      return currentTime >= tokenExpirationTime;
    }
  
    async init() {
      const authConfig = this.configManager.getAuthConfig();
  
      if (this.isTokenExpired()) {
        logger.log('Token expired, refreshing...');
        await this.authManager.refreshToken();
      }
  
      this.accessToken = authConfig.ACCESS_TOKEN;
    }
  
    async request(requestType, endpointType, endpointName) {
      try {
        await this.init(); // Ensure token is valid before making the request
  
        const endpointTemplate = this.endpoints[requestType][endpointType][endpointName];
        if (!endpointTemplate) {
          throw new Error(`Endpoint not found for ${requestType}/${endpointType}/${endpointName}`);
        }
  
        const endpoint = this.replaceConstants(endpointTemplate);
        const url = `${this.apiUrl}${endpoint}`;
        const headers = {
          'Authorization': `Bearer ${this.accessToken}`,
          'Content-Type': 'application/json',
        };
  
        logger.log(`Making ${requestType} request to ${url}`);
        const response = await axios({
          url,
          method: requestType,
          headers,
        });
  
        logger.log(`Received response with status ${response.status}`);
        return response.data;
  
      } catch (error) {
        logger.log(`Error making request to ${requestType}/${endpointType}/${endpointName}: ${error.message}`);
        throw error;
      }
    }
  }
  
  module.exports = MercadoLibreAPI;