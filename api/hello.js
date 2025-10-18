export default function handler(req, res) {
  res.status(200).json({ 
    message: 'Hello from Xstream API!',
    timestamp: new Date().toISOString(),
    status: 'working'
  });
}
