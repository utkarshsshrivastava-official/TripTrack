import dotenv from 'dotenv';
import path from 'path';

// Load environment configuration
dotenv.config({ path: path.resolve(__dirname, '../.env') });

import { app } from './app';
import { connectMongoDB } from './shared/lib/mongodb';

const PORT = process.env.PORT || 5000;

async function bootstrap() {
  // Connect to MongoDB Atlas (graceful if not configured)
  await connectMongoDB();

  app.listen(PORT, () => {
    console.log(`🚀 [TripTrack Server] Running on http://localhost:${PORT}`);
    console.log(`🏔️ [Mission] Badrinath Dham Pilgrimage 2026 (Sep 24 - Oct 02)`);
    console.log(`📡 [Health API] http://localhost:${PORT}/api/health`);
    console.log(`🌱 [Seed API]   http://localhost:${PORT}/api/seed/init`);
  });
}

bootstrap().catch((err) => {
  console.error('Fatal Server Boot Error:', err);
  process.exit(1);
});
