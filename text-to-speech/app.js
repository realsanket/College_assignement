const express = require('express');
const sdk = require('microsoft-cognitiveservices-speech-sdk');
const bodyParser = require('body-parser');
const ffmpeg = require('fluent-ffmpeg');
const fs = require('fs');
const cors = require('cors');
const corsOptions = {
  origin: '*', 
};

const app = express();
app.use(cors(corsOptions));
const port = 3000; // Replace with your preferred port




app.use(bodyParser.json());

// Set up the Speech SDK
const speechConfig = sdk.SpeechConfig.fromSubscription("replace_with_your_subscription_key","replace_with_your_region");

// const speechConfig = sdk.SpeechConfig.fromSubscription(process.env.SPEECH_KEY, process.env.SPEECH_REGION);
speechConfig.speechSynthesisVoiceName = 'hi-IN-SwaraNeural';

app.post('/synthesize', (req, res) => {
  if (!req.body || !req.body.text) {
    return res.status(400).json({ error: 'Text input is required.' });
  }

  const text = req.body.text;
  console.log('Synthesizing text:', text);
  const wavFilePath = 'synthesizedAudio.wav'; // Provide a filename
  const mp3FilePath = 'synthesizedAudio.mp3';

  const audioConfig = sdk.AudioConfig.fromAudioFileOutput(wavFilePath);
  const synthesizer = new sdk.SpeechSynthesizer(speechConfig, audioConfig);

  synthesizer.speakTextAsync(text, (result) => {
    if (result.reason === sdk.ResultReason.SynthesizingAudioCompleted) {
      console.log('Synthesis finished.');

      // Convert the WAV file to MP3 using fluent-ffmpeg
      ffmpeg()
        .input(wavFilePath)
        .toFormat('mp3')
        .on('end', () => {
          res.download(mp3FilePath, (err) => {
            if (err) {
              return res.status(500).json({ error: 'Failed to send synthesized audio.' });
            }
          });
        })
        .on('error', (err) => {
          console.error('Conversion to MP3 failed:', err);
          res.status(500).json({ error: 'Conversion to MP3 failed.' });
        })
        .save(mp3FilePath);
    } else {
      console.error('Speech synthesis canceled, ' + result.errorDetails);
      res.status(500).json({ error: 'Speech synthesis failed.' });
    }

    synthesizer.close();
  }, (err) => {
    console.trace('Error - ' + err);
    res.status(500).json({ error: 'Speech synthesis failed.' });
    synthesizer.close();
  });
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
