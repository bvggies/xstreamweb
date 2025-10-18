export default async function handler(req, res) {
  try {
    // Simple test without external dependencies
    res.status(200).json({ 
      message: 'Database test endpoint',
      status: 'ready',
      timestamp: new Date().toISOString(),
      note: 'PostgreSQL connection will be tested when dependencies are loaded'
    });
  } catch (error) {
    res.status(500).json({ 
      message: 'Database test failed',
      error: error.message 
    });
  }
}
