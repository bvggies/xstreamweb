export default function handler(req, res) {
  res.status(200).json({ 
    message: 'Xstream API is working!',
    timestamp: new Date().toISOString(),
    status: 'success'
  });
}
