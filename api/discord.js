const { verifyKey } = require('discord-interactions');
const getRawBody = require('raw-body');

// Verification function
const verifyDiscordRequest = async (req, res) => {
  const signature = req.headers['x-signature-ed25519'];
  const timestamp = req.headers['x-signature-timestamp'];
  const rawBody = await getRawBody(req);

  if (!signature || !timestamp || !rawBody) {
    return false;
  }

  try {
    return verifyKey(rawBody, signature, timestamp, process.env.DISCORD_PUBLIC_KEY);
  } catch (err) {
    return false;
  }
};

module.exports = async (req, res) => {
  // Verify the request
  const isValid = await verifyDiscordRequest(req, res);
  if (!isValid) {
    return res.status(401).json({ error: 'Invalid request signature' });
  }

  // Parse the request body
  const body = JSON.parse(req.body.toString());

  // Handle Discord's verification challenge
  if (body.type === 1) {
    return res.json({ type: 1 });
  }

  // Handle commands
  if (body.type === 2) {
    const { data } = body;
    
    switch (data.name) {
      case 'hello':
        return res.json({
          type: 4,
          data: {
            content: `Hello ${body.member.user.username}!`
          }
        });
      
      default:
        return res.status(400).json({ error: 'Unknown command' });
    }
  }

  return res.status(400).json({ error: 'Unknown type' });
};

    

    