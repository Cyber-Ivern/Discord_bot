import { verifyDiscordRequest } from './utils/verifyDiscord';
import { handleCommand } from './utils/commands';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).end();
  }

  // Verify the request is from Discord
  const verified = await verifyDiscordRequest(req);
  if (!verified) {
    return res.status(401).json({ error: 'Invalid request signature' });
  }

  // Handle PING request
  if (req.body.type === 1) {
    return res.status(200).json({ type: 1 });
  }

  // Handle commands
  try {
    const response = await handleCommand(req.body);
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
    

    
