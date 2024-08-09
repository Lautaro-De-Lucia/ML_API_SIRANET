const siranetAPI = require('./siranet-api');

const args = process.argv.slice(2);
const command = args[0];

const main = async () => {
  if (command.startsWith('siranet.')) {
    const apiCommand = command.replace('siranet.', '').trim();
    try {
      const result = await siranetAPI.request(apiCommand);
      console.log(result);
    } catch (error) {
      console.error('Error executing API request:', error.message);
    }
  } else {
    console.log('Unknown command');
  }
};

main();
