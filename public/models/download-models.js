const https = require('https');
const fs = require('fs');
const path = require('path');

const models = [
  'tiny_face_detector_model-weights_manifest.json',
  'tiny_face_detector_model-shard1',
  'face_landmark_68_model-weights_manifest.json',
  'face_landmark_68_model-shard1'
];

const baseUrl = 'https://raw.githubusercontent.com/justadudewhohacks/face-api.js/master/weights/';

models.forEach(model => {
  const url = baseUrl + model;
  const file = fs.createWriteStream(path.join(__dirname, model));
  
  https.get(url, (response) => {
    response.pipe(file);
    file.on('finish', () => {
      file.close();
      console.log(`Downloaded: ${model}`);
    });
  }).on('error', (err) => {
    fs.unlink(path.join(__dirname, model), () => {});
    console.error(`Error downloading ${model}: ${err.message}`);
  });
});
