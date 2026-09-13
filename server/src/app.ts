import express from 'express';
import cors from 'cors';
import seedRoutes from './modules/seed/seed.routes';
import vaultRoutes from './modules/vault/vault.routes';
import segmentRoutes from './modules/itinerary/segment.routes';
import telemetryRoutes from './modules/tracking/telemetry.routes';
import voiceRoutes from './modules/voice/voice.routes';
import { notificationsRouter } from './modules/notifications/notifications.routes';
import travellerRoutes from './modules/traveller/traveller.routes';
import { errorHandler } from './shared/middleware/errorHandler';
import { rateLimiter } from './shared/middleware/rateLimiter';
import { familyPinMutationsOnly } from './shared/middleware/familyPinAuth';
import { LocationPingModel } from './models/locationPing.model';
import { isMongoConnected } from './shared/lib/mongodb';

export const app = express();

// Global Rate Limiter to protect free-tier APIs and database
app.use('/api', rateLimiter);

// Middleware
app.use(cors({
  origin: '*',
  methods: ['GET', 'POST', 'PATCH', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization', 'x-family-pin']
}));

app.use(express.json({ limit: '15mb' }));
app.use(express.urlencoded({ extended: true }));

// Health Check Endpoint (Public)
app.get('/api/health', (_req, res) => {
  res.json({
    status: 'ok',
    app: 'TripTrack API',
    version: '1.0.0',
    target: 'Badrinath Dham Pilgrimage 2026',
    mongoConnected: isMongoConnected(),
    timestamp: new Date().toISOString()
  });
});

// Protected Modular Routes (Mutations require x-family-pin header)
app.use('/api/seed', familyPinMutationsOnly, seedRoutes);
app.use('/api/documents', familyPinMutationsOnly, vaultRoutes);
app.use('/api/segments', familyPinMutationsOnly, segmentRoutes);
app.use('/api/telemetry', familyPinMutationsOnly, telemetryRoutes);
app.use('/api/voice', familyPinMutationsOnly, voiceRoutes);
app.use('/api/notifications', familyPinMutationsOnly, notificationsRouter);
app.use('/api/travellers', familyPinMutationsOnly, travellerRoutes);

// Bulk Ping Ingestion for Offline Queue Sync
app.post('/api/tracking/bulk-ping', familyPinMutationsOnly, async (req, res) => {
  try {
    const { pings } = req.body;
    if (!Array.isArray(pings) || pings.length === 0) {
      res.json({ success: true, count: 0, message: 'No pings supplied' });
      return;
    }

    if (isMongoConnected()) {
      await LocationPingModel.insertMany(
        pings.map((p: any) => ({
          ...p,
          deviceTimestamp: new Date(p.deviceTimestamp)
        }))
      );
    }

    console.log(`📡 [Tracking] Successfully ingested ${pings.length} batched pings from dead-zone reconnect.`);
    res.json({
      success: true,
      count: pings.length,
      message: `Ingested ${pings.length} location snapshots`
    });
  } catch (err: any) {
    console.error('Error ingesting bulk pings', err);
    res.status(500).json({ success: false, error: err.message });
  }
});

// Global structured error handler
app.use(errorHandler);
