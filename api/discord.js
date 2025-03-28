const { InteractionType } = require('discord-interactions');
const verifyDiscordRequest = require('./utils/verifyDiscord');
const { handleCommand } = require('./utils/commands');

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).end();
  }

  // Verify the request using your existing verifyDiscord utility
  const verified = await verifyDiscordRequest(req);
  if (!verified) {
    return res.status(401).json({ error: 'Invalid request signature' });
  }

  // Parse the request body
  const message = req.body;

  // Handle PING request
  if (message.type === 1) {
    return res.status(200).json({ type: 1 });
  }

  // Handle commands
  try {
    const response = await handleCommand(message);  // Make sure to await here
    return res.status(200).json(response);
  } catch (error) {
    console.error('Error handling command:', error);
    return res.status(500).json({
      type: 4,
      data: {
        content: 'There was an error processing your command.'
      }
    });
  }
}
    

    
