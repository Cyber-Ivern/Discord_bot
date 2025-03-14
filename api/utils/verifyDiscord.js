const { verifyKey, InteractionType, InteractionResponseType } = require('discord-interactions');

async function verifyDiscordRequest(req) {
  try {
    const signature = req.headers['x-signature-ed25519'];
    const timestamp = req.headers['x-signature-timestamp'];
    
    if (!signature || !timestamp || !process.env.DISCORD_PUBLIC_KEY) {
      console.error('Missing required headers or DISCORD_PUBLIC_KEY');
      return { isValidRequest: false };
    }

    const rawBody = JSON.stringify(req.body);

    const isValidRequest = verifyKey(
      rawBody,
      signature,
      timestamp,
      process.env.DISCORD_PUBLIC_KEY
    );

    if (!isValidRequest) {
      console.error('Invalid request signature');
      return { isValidRequest: false };
    }

    // Handle Discord's ping-pong verification challenge
    if (req.body.type === InteractionType.PING) {
      return {
        isValidRequest: true,
        isPing: true,
        response: {
          type: InteractionResponseType.PONG
        }
      };
    }

    // For normal commands
    return {
      isValidRequest: true,
      isPing: false,
      message: req.body
    };
  } catch (error) {
    console.error('Error in verifyDiscordRequest:', error);
    return { isValidRequest: false };
  }
}

module.exports = verifyDiscordRequest; 
