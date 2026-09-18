import dotenv from 'dotenv';
import path from 'path';

// Load environment configuration (override stale OS environment variables with local .env)
dotenv.config({ path: path.resolve(__dirname, '../.env'), override: true });

import http from 'http';
import { app } from './app';
import { connectMongoDB } from './shared/lib/mongodb';
import { initSocketServer } from './modules/chat/socket.service';
import { automationService } from './modules/notifications/automation.service';

const PORT = Number(process.env.PORT) || 5000;
const HOST = '0.0.0.0';

async function bootstrap() {
  // Connect to MongoDB Atlas (graceful if not configured)
  await connectMongoDB();

  // Create Native HTTP server wrapping Express app
  const httpServer = http.createServer(app);

  // Attach Socket.io server
  initSocketServer(httpServer);

  // Start Autonomous Pilgrimage Briefings & Evening Digest Scheduler
  automationService.startScheduler();

  httpServer.listen(PORT, HOST, () => {
    console.log(`🚀 [TripTrack Server] Running on http://${HOST}:${PORT}`);
    console.log(`🏔️ [Mission] Badrinath Dham Pilgrimage 2026 (Sep 24 - Oct 02)`);
    console.log(`📡 [Health API] http://${HOST}:${PORT}/api/health`);
    console.log(`🌱 [Seed API]   http://${HOST}:${PORT}/api/seed/init`);
    console.log(`🔌 [Socket.io]  Live In-Family Room Ready on ws://${HOST}:${PORT}`);
  });
}

bootstrap().catch((err) => {
  console.error('Fatal Server Boot Error:', err);
  process.exit(1);
});
