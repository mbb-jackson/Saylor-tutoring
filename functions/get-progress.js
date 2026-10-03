exports.handler = async (event) => {
  // Simple endpoint to retrieve latest progress
  // In production, this would fetch from a database or cached file

  try {
    // For now, return a placeholder
    // The coach dashboard will use this as a fallback
    return {
      statusCode: 200,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*'
      },
      body: JSON.stringify({
        message: 'Use export from iPad or open coach.html on iPad to sync',
        lastSync: null
      })
    };
  } catch (err) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: err.message })
    };
  }
};
