import { Request, Response } from 'express';
import { LocationPingModel } from '../../models/locationPing.model';
import { isMongoConnected } from '../../shared/lib/mongodb';

// In-memory telemetry fallback store
let memoryPings: any[] = [];

export async function pingLocationHandler(req: Request, res: Response): Promise<void> {
  const {
    passengerId,
    latitude,
    longitude,
    altitudeMeters,
    batteryLevel,
    checkpointName,
    elderVitalsNote,
    deviceTimestamp
  } = req.body;

  try {
    const payload = {
      passengerId: passengerId || 'traveller-utkarsh',
      latitude: Number(latitude),
      longitude: Number(longitude),
      altitudeMeters: Number(altitudeMeters) || undefined,
      batteryLevel: Number(batteryLevel) || undefined,
      checkpointName,
      elderVitalsNote,
      deviceTimestamp: deviceTimestamp ? new Date(deviceTimestamp) : new Date(),
      serverReceivedAt: new Date()
    };

    if (isMongoConnected()) {
      const saved = await LocationPingModel.create(payload);
      res.json({ success: true, mode: 'mongodb', data: saved });
      return;
    }

    // Memory fallback
    memoryPings.unshift(payload);
    if (memoryPings.length > 500) memoryPings.pop();

    res.json({ success: true, mode: 'memory', data: payload });
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message });
  }
}

export async function bulkPingHandler(req: Request, res: Response): Promise<void> {
  const { pings } = req.body;

  if (!Array.isArray(pings) || pings.length === 0) {
    res.status(400).json({ success: false, error: 'Expected non-empty array of pings' });
    return;
  }

  try {
    const formatted = pings.map(p => ({
      passengerId: p.passengerId || 'traveller-utkarsh',
      latitude: Number(p.latitude),
      longitude: Number(p.longitude),
      altitudeMeters: Number(p.altitudeMeters) || undefined,
      batteryLevel: Number(p.batteryLevel) || undefined,
      checkpointName: p.checkpointName,
      elderVitalsNote: p.elderVitalsNote,
      deviceTimestamp: p.deviceTimestamp ? new Date(p.deviceTimestamp) : new Date(),
      serverReceivedAt: new Date()
    }));

    if (isMongoConnected()) {
      await LocationPingModel.insertMany(formatted);
      res.json({ success: true, count: formatted.length, mode: 'mongodb' });
      return;
    }

    memoryPings = [...formatted, ...memoryPings].slice(0, 500);
    res.json({ success: true, count: formatted.length, mode: 'memory' });
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message });
  }
}

export async function getLatestTelemetryHandler(_req: Request, res: Response): Promise<void> {
  try {
    if (isMongoConnected()) {
      // Find latest ping for each traveller
      const latest = await LocationPingModel.aggregate([
        { $sort: { deviceTimestamp: -1 } },
        {
          $group: {
            _id: '$passengerId',
            latestPing: { $first: '$$ROOT' }
          }
        }
      ]);
      res.json({ success: true, mode: 'mongodb', data: latest });
      return;
    }

    // Group in memory
    const map = new Map<string, any>();
    for (const p of memoryPings) {
      if (!map.has(p.passengerId)) {
        map.set(p.passengerId, p);
      }
    }
    const latestList = Array.from(map.entries()).map(([k, v]) => ({
      _id: k,
      latestPing: v
    }));

    res.json({ success: true, mode: 'memory', data: latestList });
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message });
  }
}
