const { InteractionResponseType } = require('discord-interactions');

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
      // First, acknowledge the command immediately
      

      const zipCode = message.data.options[0].value;
      const apiKey = 'weatherApiKey'; // Move this to environment variables!

      const response = await fetch(
        `https://api.openweathermap.org/data/2.5/weather?zip=${zipCode},us&units=imperial&appid=${apiKey}`,
        {timeout: 10000}
      );

      

      const data = await response.json();
      
      if (data.cod !== 200) {
        return {
          type: InteractionResponseType.UPDATE_MESSAGE,
          data: {
            content: 'Error: Invalid zip code or weather data unavailable.'
          }
        };
      }

      

      const weather = {
        temp: Math.round(data.main.temp),
        description: data.weather[0].description,
        humidity: data.main.humidity,
        windSpeed: Math.round(data.wind.speed),
        city: data.name
      };

      return {
        type: InteractionResponseType.UPDATE_MESSAGE,
        data: {
          content: `Weather in ${weather.city} (${zipCode}):\n` +
                  `🌡️ Temperature: ${weather.temp}°F\n` +
                  `🌥️ Conditions: ${weather.description}\n` +
                  `💧 Humidity: ${weather.humidity}%\n` +
                  `💨 Wind Speed: ${weather.windSpeed} mph`
        }
      };
    } catch (error) {
      console.error('Error:', error);
      return {
        type: InteractionResponseType.UPDATE_MESSAGE,
        data: {
          content: 'Sorry, there was an error fetching the weather data. Please try again.'
        }
      };
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