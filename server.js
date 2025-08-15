const express = require('express');
const cors = require('cors');
const ytdl = require('ytdl-core');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());

app.get('/', (req, res) => {
  res.send('YDL Backend Server taiyaar hai!');
});

app.get('/download', async (req, res) => {
  try {
    const videoURL = req.query.url;
    if (!videoURL || !ytdl.validateURL(videoURL)) {
      return res.status(400).json({ success: false, error: 'Please ek sahi YouTube URL daalein.' });
    }
    const info = await ytdl.getInfo(videoURL);
    const videoFormats = ytdl.filterFormats(info.formats, 'videoandaudio');
    const audioFormats = ytdl.filterFormats(info.formats, 'audioonly');

    res.json({
      success: true,
      title: info.videoDetails.title,
      thumbnail: info.videoDetails.thumbnails[info.videoDetails.thumbnails.length - 1].url,
      duration: info.videoDetails.lengthSeconds,
      videoFormats: videoFormats,
      audioFormats: audioFormats,
    });
  } catch (error) {
    console.error('Error aaya:', error.message);
    res.status(500).json({ success: false, error: 'Video ki details nahi mil paayi.' });
  }
});

app.listen(PORT, () => {
  console.log(`Server port ${PORT} par chal raha hai.`);
});
