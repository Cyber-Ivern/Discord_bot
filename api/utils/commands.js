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
      
      // Return an object that indicates we need deferral and includes the follow-up logic
      return {
        defer: true,
        initialResponse: {
          type: InteractionResponseType.DEFERRED_CHANNEL_MESSAGE_WITH_SOURCE,
          data: {
            content: 'Fetching weather data...'
          }
        },
        followUp: async () => {
          const zipCode = message.data.options[0].value;
          const apiKey = process.env.WEATHER_API_KEY;

          const response = await fetch(
            `https://api.openweathermap.org/data/2.5/weather?zip=${zipCode},us&units=imperial&appid=${apiKey}`,
            {timeout: 10000}
          );

          const data = await response.json();
          
          if (data.cod !== 200) {
            return {
              content: 'Error: Invalid zip code or weather data unavailable.'
            };
          }

          return {
            content: `Weather in ${data.name}: ${data.main.temp}°F, ${data.weather[0].description}`
          };
        }
      };

    } catch (error) {
      console.error('Error:', error);
      return {
        type: InteractionResponseType.CHANNEL_MESSAGE_WITH_SOURCE,
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
  
  const result = commandHandler(message);

  if (result.defer) {
    // First send the deferred response
    const initialResponse = result.initialResponse;
    
    // After sending deferred response, send the follow-up
    const followUpUrl = `https://discord.com/api/v10/webhooks/${process.env.DISCORD_APPLICATION_ID}/${message.token}`;
    
    // Execute the follow-up after returning the initial response
    result.followUp().then(followUpData => {
      fetch(followUpUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(followUpData),
      });
    }).catch(error => {
      console.error('Error in follow-up:', error);
      fetch(followUpUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          content: 'An error occurred while fetching the weather data.'
        }),
      });
    });

    return initialResponse;
  }
  
  return result;
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