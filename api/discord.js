const { InteractionType, InteractionResponseType, verifyKey } = require('discord-interactions');

async function verify(req) {
  const signature = req.headers['x-signature-ed25519'];
  const timestamp = req.headers['x-signature-timestamp'];
  const body = await req.text();

  const isValidRequest = verifyKey(
    body,
    signature,
    timestamp,
    process.env.DISCORD_PUBLIC_KEY
  );

  return { isValidRequest, body };
}

module.exports = async (req, res) => {
  if (req.method !== 'POST') {
    return res.status(405).send('Method not allowed');
  }

  try {
    const { isValidRequest, body } = await verify(req);
    
    if (!isValidRequest) {
      return res.status(401).send('Invalid signature');
    }

    const message = JSON.parse(body);

    if (message.type === InteractionType.PING) {
      return res.json({
        type: InteractionResponseType.PONG
      });
    }

    if (message.type === InteractionType.APPLICATION_COMMAND) {
      const { name } = message.data;

      if (name === 'hello') {
        return res.json({
          type: InteractionResponseType.CHANNEL_MESSAGE_WITH_SOURCE,
          data: {
            content: `Hello ${message.member.user.username}!`,
          },
        });
      }
    }

    return res.status(400).send('Unknown type');
  } catch (err) {
    console.error('Error processing request:', err);
    return res.status(500).send('Internal server error');
  }
};

export const config = {
  api: {
    bodyParser: false,
  },
};

    

    