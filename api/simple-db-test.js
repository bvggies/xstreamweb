export default function handler(req, res) {
  res.status(200).json({ 
    message: 'Simple database test endpoint',
    status: 'working',
    timestamp: new Date().toISOString(),
    note: 'This endpoint works without external dependencies'
  });
}
