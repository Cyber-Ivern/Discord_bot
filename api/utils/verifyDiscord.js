const { verifyKey } = require('discord-interactions');

function verifyDiscordRequest(request) {
  const signature = request.headers['x-signature-ed25519'];
  const timestamp = request.headers['x-signature-timestamp'];
  const rawBody = JSON.stringify(request.body); // Convert body to string

  if (!signature || !timestamp || !rawBody) {
    return false;
  }

  try {
    const isValidRequest = verifyKey(
      rawBody,
      signature,
      timestamp,
      process.env.DISCORD_PUBLIC_KEY
    );
    return isValidRequest;
  } catch (err) {
    console.error('Error verifying request:', err);
    return false;
  }
}

module.exports = verifyDiscordRequest;
