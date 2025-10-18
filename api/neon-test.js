export default function handler(req, res) {
  res.status(200).json({ 
    message: 'Neon database test endpoint',
    status: 'ready',
    timestamp: new Date().toISOString(),
    connectionString: 'postgresql://neondb_owner:npg_RonBSr8up4UH@ep-gentle-bird-adtw7fcr-pooler.c-2.us-east-1.aws.neon.tech/neondb?sslmode=require',
    note: 'Database connection will be tested when dependencies are loaded'
  });
}
