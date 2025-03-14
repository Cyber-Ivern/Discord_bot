const { InteractionType } = require('discord-interactions');
const verifyDiscordRequest = require('./utils/verifyDiscord');
const { handleCommand } = require('./utils/commands');

module.exports = async (req, res) => {
  // Log incoming request details (helpful for debugging)
  console.log('Received request:', {
    method: req.method,
    headers: req.headers,
    body: req.body
  });

  if (req.method !== 'POST') {
    return res.status(405).send('Method not allowed');
  }

  try {
    const verification = await verifyDiscordRequest(req);
    
    if (!verification.isValidRequest) {
      return res.status(401).send('Invalid request signature');
    }

    // Handle Discord's verification challenge
    if (verification.isPing) {
      console.log('Responding to ping challenge');
      return res.json(verification.response);
    }

    // Handle commands
    if (verification.message.type === InteractionType.APPLICATION_COMMAND) {
      console.log('Handling command:', verification.message.data.name);
      const response = handleCommand(verification.message);
      return res.json(response);
    }

    return res.status(400).send('Unknown interaction type');
  } catch (err) {
    console.error('Error processing request:', err);
    return res.status(500).json({ 
      error: err.message || 'Internal server error'
    });
  }
};
    

    
