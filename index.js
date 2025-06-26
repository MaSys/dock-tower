const express = require('express');
const Docker = require('dockerode');
const axios = require('axios');
const cors = require('cors');
const path = require('path');

const app = express();
const docker = new Docker();
app.use(cors());

// Helper to get latest tag from Docker Hub
async function getLatestTag(imageName) {
  try {
    // Split image name (repo[:tag])
    const [repo] = imageName.split(':');
    // Docker Hub API expects library/ prefix for official images
    const hubRepo = repo.includes('/') ? repo : `library/${repo}`;
    const url = `https://registry.hub.docker.com/v2/repositories/${hubRepo}/tags?page_size=1&ordering=last_updated`;
    const res = await axios.get(url);
    if (res.data.results && res.data.results.length > 0) {
      return res.data.results[0].name;
    }
  } catch (e) {
    // Ignore errors (private images, etc.)
  }
  return null;
}

app.get('/api/image-updates', async (req, res) => {
  try {
    const containers = await docker.listContainers();
    const results = await Promise.all(containers.map(async (container) => {
      const image = container.Image;
      const currentTag = image.includes(':') ? image.split(':')[1] : 'latest';
      const latestTag = await getLatestTag(image);
      return {
        containerName: container.Names[0].replace(/^\//, ''),
        image,
        currentTag,
        latestTag,
        updateAvailable: latestTag && latestTag !== currentTag,
      };
    }));
    // Sort: updateAvailable first, then containerName
    results.sort((a, b) => {
      if (a.updateAvailable === b.updateAvailable) {
        return a.containerName.localeCompare(b.containerName);
      }
      return a.updateAvailable ? -1 : 1;
    });
    res.json(results);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Serve React static files
app.use(express.static('public'));

// Fallback: serve React app for any non-API route
//app.get('*', (req, res) => {
//  res.sendFile(path.join(__dirname, 'public', 'index.html'));
//});

const PORT = process.env.PORT || 4000;
server = app.listen(PORT, () => {
  console.log(`Backend listening on port ${PORT}`);
}); 
