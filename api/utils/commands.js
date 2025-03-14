const { InteractionResponseType } = require('discord-interactions');

const commands = {
  hello: (message) => ({
    type: InteractionResponseType.CHANNEL_MESSAGE_WITH_SOURCE,
    data: {
      content: `Hello ${message.member.user.username}!`,
    },
  }),
  // Add more commands here
};

function handleCommand(message) {
  const { name } = message.data;
  const commandHandler = commands[name];
  
  if (!commandHandler) {
    throw new Error(`Unknown command: ${name}`);
  }
  
  return commandHandler(message);
}

// Export the commands object for registration
module.exports = {
  handleCommand,
  commands: [
    {
      name: 'hello',
      description: 'Says hello to the user'
    }
    // Add more command definitions here
  ]
}; 