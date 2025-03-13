const { REST, Routes } = require('discord.js');
require('dotenv').config();

const commands = [
  {
    name: 'hello',
    description: 'Says hello to the user'
  }
];

const rest = new REST({ version: '10' }).setToken(process.env.DISCORD_TOKEN);

(async () => {
  try {
    console.log('Registering slash commands...');

    await rest.put(
      Routes.applicationCommands(process.env.DISCORD_CLIENT_ID),
      { body: commands }
    );

    console.log('Successfully registered commands!');
  } catch (error) {
    console.error(error);
  }
})();
