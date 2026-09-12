import { Request, Response, NextFunction } from 'express';

export function verifyFamilyPin(req: Request, res: Response, next: NextFunction): void {
  const expectedPin = process.env.FAMILY_PIN || '2026';
  const providedPin = req.headers['x-family-pin'] || req.query.pin;

  // In development, PIN check can be optional if not explicitly set
  if (process.env.NODE_ENV === 'development' && !req.headers['x-family-pin']) {
    return next();
  }

  if (providedPin !== expectedPin) {
    res.status(401).json({
      error: 'Unauthorized',
      message: 'Invalid Family PIN provided for TripTrack access.'
    });
    return;
  }

  next();
}
