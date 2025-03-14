const { REST, Routes } = require('discord.js');
require('dotenv').config();

// Debug: Check if .env is being loaded
console.log('Environment variables loaded:', {
  tokenExists: !!process.env.DISCORD_TOKEN,
  clientIdExists: !!process.env.DISCORD_CLIENT_ID,
  publicKeyExists: !!process.env.DISCORD_PUBLIC_KEY
});

// Import our commands
const { commands } = require('./api/utils/commands');

// Create REST instance
const rest = new REST({ version: '10' }).setToken(process.env.DISCORD_TOKEN);

async function registerCommands() {
  try {
    // Log the commands being registered
    console.log('Commands to register:', JSON.stringify(commands, null, 2));
    console.log('Started refreshing application (/) commands.');

    // Check if environment variables are set
    if (!process.env.DISCORD_TOKEN || !process.env.DISCORD_CLIENT_ID) {
      console.error('Missing variables:', {
        token: !process.env.DISCORD_TOKEN ? 'missing' : 'exists',
        clientId: !process.env.DISCORD_CLIENT_ID ? 'missing' : 'exists'
      });
      throw new Error('Missing required environment variables');
    }

    const result = await rest.put(
      Routes.applicationCommands(process.env.DISCORD_CLIENT_ID),
      { body: commands }
    );

    console.log('Successfully reloaded application (/) commands.');
    console.log('Registered commands:', result);
  } catch (error) {
    console.error('Error registering commands:', error);
    // Log more detailed error information
    if (error.code === 50035) {
      console.error('Invalid command format. Check the command structure.');
      console.error('Error details:', error.errors);
    }
  }
}

registerCommands();
