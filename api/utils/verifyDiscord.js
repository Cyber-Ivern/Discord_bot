const { verifyKey, InteractionType, InteractionResponseType } = require('discord-interactions');

async function verifyDiscordRequest(req) {

  const signature = req.headers['x-signature-ed25519'];
  const timestamp = req.headers['x-signature-timestamp'];

  const rawBody = req.body;
  const body = json.stringify(rawBody);


  const isValidRequest = verifyKey(
    body,
    signature,
    timestamp,
    process.env.DISCORD_PUBLIC_KEY
  );

  if (!isValidRequest) {
    return { 
      isValidRequest: false 
    };
  }

  // Since we already have the parsed body, no need to parse again
  const message = rawBody;

  // Handle Discord's ping-pong verification challenge
  if (message.type === InteractionType.PING) {
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
    message
  };
}

module.exports = verifyDiscordRequest; 

