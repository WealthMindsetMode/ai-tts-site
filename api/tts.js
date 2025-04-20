export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { text, voiceName } = req.body;

  if (!text || !voiceName) {
    return res.status(400).json({ error: 'Missing text or voiceName' });
  }

  const apiKey = process.env.TTS_API_KEY;  
  console.log("GOOGLE_API_KEY:", apiKey);
  
  try {
    const response = await fetch(`https://texttospeech.googleapis.com/v1/text:synthesize?key=${apiKey}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        input: { text },
        voice: {
          languageCode: voiceName.substring(0, 5),
          name: voiceName
        },
        audioConfig: { audioEncoding: 'MP3' }
      })
    });

    const data = await response.json();

    if (data.audioContent) {
      res.status(200).json({ audioContent: data.audioContent });
    } else {
      res.status(500).json({ error: data.error?.message || 'Failed to synthesize speech.' });
    }
  } catch (err) {
    res.status(500).json({ error: err.message || 'Internal server error' });
  }
}
