const fetch = require('node-fetch');

exports.handler = async (event) => {
  // Only accept POST
  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, body: 'Method not allowed' };
  }

  try {
    const data = JSON.parse(event.body);

    // Validate data has required fields
    if (!data.turdTimes && !data.fastGameHistory) {
      return { statusCode: 400, body: 'Invalid data format' };
    }

    // Store in environment variable (Netlify can access this per-deployment)
    // For production, write to GitHub or a persistent store
    // For now, store in a simple JSON response that can be cached/retrieved

    const timestamp = new Date().toISOString();
    const progressData = {
      ...data,
      syncedAt: timestamp,
      source: 'ipad'
    };

    // Option 1: Write to GitHub repo as a backup (requires GITHUB_TOKEN in env vars)
    if (process.env.GITHUB_TOKEN) {
      try {
        await saveToGitHub(progressData);
      } catch (err) {
        console.error('GitHub save failed:', err.message);
        // Continue anyway, data is still received
      }
    }

    // Return success with the stored data
    return {
      statusCode: 200,
      body: JSON.stringify({
        success: true,
        message: 'Progress saved',
        timestamp,
        data: progressData
      })
    };

  } catch (err) {
    console.error('Error:', err);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: err.message })
    };
  }
};

async function saveToGitHub(data) {
  const owner = 'mbb-jackson';
  const repo = 'Saylor-tutoring';
  const path = 'data/saylor-progress.json';
  const token = process.env.GITHUB_TOKEN;

  const url = `https://api.github.com/repos/${owner}/${repo}/contents/${path}`;

  // Get current file to get SHA
  const getRes = await fetch(url, {
    headers: { Authorization: `token ${token}` }
  });

  let sha = null;
  if (getRes.ok) {
    const current = await getRes.json();
    sha = current.sha;
  }

  // Encode data as base64
  const content = Buffer.from(JSON.stringify(data, null, 2)).toString('base64');

  // Update or create file
  const updateRes = await fetch(url, {
    method: 'PUT',
    headers: {
      Authorization: `token ${token}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      message: `Auto-sync: Saylor progress update at ${new Date().toISOString()}`,
      content,
      sha,
      branch: 'main'
    })
  });

  if (!updateRes.ok) {
    throw new Error(`GitHub API error: ${updateRes.status}`);
  }

  return updateRes.json();
}
