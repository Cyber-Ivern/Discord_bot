const { InteractionResponseType } = require('discord-interactions');
const { verifyKey } = require('discord-interactions');


const commands = {
  hello: (message) => ({
    type: InteractionResponseType.CHANNEL_MESSAGE_WITH_SOURCE,
    data: {
      content: `Hello ${message.member.user.username}!`,
    },
  }),
  // Add more commands here
  time: (message) => ({
    type: InteractionResponseType.CHANNEL_MESSAGE_WITH_SOURCE,
    data: {
      content: `The current date and time is ${new Date().toLocaleString()}`,
    },
  }),
  weather: async (message) => {
    try {
      console.log('Message object:', message);
      
      // First send a deferred response
      await fetch(`https://discord.com/api/v10/interactions/${message.id}/${message.token}/callback`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          type: InteractionResponseType.DEFERRED_CHANNEL_MESSAGE_WITH_SOURCE
        }),
      });

      const zipCode = message.data.options[0].value;
      const apiKey = process.env.WEATHER_API_KEY;

      const response = await fetch(
        `https://api.openweathermap.org/data/2.5/weather?zip=${zipCode},us&units=imperial&appid=${apiKey}`,
        {timeout: 10000}
      );

      const data = await response.json();
      
      // Now send the follow-up message with the weather data
      const followUpUrl = `https://discord.com/api/v10/webhooks/${process.env.DISCORD_APPLICATION_ID}/${message.token}`;
      
      if (data.cod !== 200) {
        return fetch(followUpUrl, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            content: 'Error: Invalid zip code or weather data unavailable.'
          }),
        });
      }

      return fetch(followUpUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          content: `Weather in ${data.name}: ${data.main.temp}°F, ${data.weather[0].description}`
        }),
      });

    } catch (error) {
      console.error('Error:', error);
      const followUpUrl = `https://discord.com/api/v10/webhooks/${process.env.DISCORD_APPLICATION_ID}/${message.token}`;
      return fetch(followUpUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          content: 'Sorry, there was an error fetching the weather data. Please try again.'
        }),
      });
    }
  }
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
  // Command definitions in the format Discord expects
  commands: [
    {
      name: 'hello',
      description: 'Says hello to the user',
      type: 1  // CHAT_INPUT type
    },
    // Add more command definitions here
    {
      name: 'time',
      description: 'Responds with the current time',
      type: 1
    },
    {
      name: 'weather',
      description: 'Get weather information for a zip code',
      type: 1,
      options: [
        {
          name: 'zipcode',
          description: 'Enter the zip code',
          type: 3, // STRING type
          required: true
        }
      ]
    }
  ]
}; 