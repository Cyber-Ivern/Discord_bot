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
    return res.status(500).json({ error: 'Public key not configured' });
  }

  // Handle Discord's verification challenge
  if (req.body.type === 1) {
    return res.json({ type: 1 });
  }

  // Handle commands
  if (req.body.type === 2) {
    const { data } = req.body;
    
    switch (data.name) {
      case 'hello':
        return res.json({
          type: 4,
          data: {
            content: `Hello ${req.body.member.user.username}!`
          }
        });
      
      default:
        return res.status(400).json({ error: 'Unknown command' });
    }
  }

  return res.status(400).json({ error: 'Unknown type' });
};

    

    