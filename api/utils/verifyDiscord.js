import { verifyKey } from 'discord-interactions';

export function verifyDiscordRequest(request) {
  const signature = request.headers['x-signature-ed25519'];
  const timestamp = request.headers['x-signature-timestamp'];
  const body = request.body; // rawBody for Vercel

  const isValidRequest = verifyKey(
    body,
    signature,
    timestamp,
    process.env.DISCORD_PUBLIC_KEY
  );

  return isValidRequest;
} 
