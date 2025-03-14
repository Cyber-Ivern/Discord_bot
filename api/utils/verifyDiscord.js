const { verifyKey, InteractionType, InteractionResponseType } = require('discord-interactions');

async function verifyDiscordRequest(req) {
  const signature = req.headers['x-signature-ed25519'];
  const timestamp = req.headers['x-signature-timestamp'];
  const body = await req.text();

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

  const message = JSON.parse(body);

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