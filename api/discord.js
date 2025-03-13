const { verifyKey } = require('discord-interactions');

// Verification middleware
const verifyDiscordRequest = (clientKey) => {
  return function (req, res, buf) {
    const signature = req.get('X-Signature-Ed25519');
    const timestamp = req.get('X-Signature-Timestamp');

    const isValidRequest = verifyKey(buf, signature, timestamp, clientKey);
    if (!isValidRequest) {
      res.status(401).send('Bad request signature');
      throw new Error('Bad request signature');
    }
  };
};

module.exports = async (req, res) => {
  // Verify the request is from Discord
  if (!process.env.DISCORD_PUBLIC_KEY) {
    console.error('Discord public key not found in environment variables');
    return res.status(500).json({ error: 'Public key not configured' });
  }

  // Handle Discord's verification challenge
  if (req.body.type === 1) {
    return res.json({ type: 1 });
  }

  // Handle commands
  if (req.body.type === 2) {
    const { data } = req.body;
    
    try {
      switch (data.name) {
        case 'hello':
          return res.json({
            type: 4, // CHANNEL_MESSAGE_WITH_SOURCE
            data: {
              content: `Hello ${req.body.member.user.username}!`,
            },
          });
        
        default:
          console.error('Unknown command:', data.name);
          return res.status(400).json({ error: 'Unknown command' });
      }
    } catch (error) {
      console.error('Error processing command:', error);
      return res.status(500).json({ 
        error: 'An error occurred while processing the command' 
      });
    }
  }

  return res.status(400).json({ error: 'Unknown interaction type' });
};

    

    