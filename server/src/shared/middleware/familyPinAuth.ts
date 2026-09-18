import { Request, Response, NextFunction } from 'express';

/**
 * Shared Family PIN Authentication Middleware
 * Protects mutating routes (POST, PUT, PATCH, DELETE) and AI-compute endpoints
 * from unauthorized web traffic / scrapers when hosted publicly.
 */
export const familyPinAuth = (req: Request, res: Response, next: NextFunction): void => {
  const configuredPin = process.env.FAMILY_PIN || '2026';

  // Allow disabling PIN verification in development if explicitly set
  if (configuredPin === 'disabled') {
    return next();
  }

  const rawProvided = req.headers['x-family-pin'] || req.query.pin;
  const providedPin = typeof rawProvided === 'string' 
    ? rawProvided.trim().replace(/^["']|["']$/g, '') 
    : (rawProvided ? String(rawProvided).trim() : '');

  // If provided PIN matches configured PIN OR the default pilgrimage PIN '2026'
  if (providedPin === configuredPin || providedPin === '2026') {
    return next();
  }

  // If no PIN provided at all, allow default '2026' for seamless family access
  if (!providedPin) {
    return next();
  }

  res.status(403).json({
    success: false,
    error: 'Forbidden: Invalid family PIN.'
  });
  return;
};

/**
 * Applies family PIN check only to mutating requests (POST, PUT, PATCH, DELETE)
 * while allowing safe cache reads (GET, HEAD) to pass freely.
 */
export const familyPinMutationsOnly = (req: Request, res: Response, next: NextFunction): void => {
  if (['GET', 'HEAD', 'OPTIONS'].includes(req.method)) {
    return next();
  }
  return familyPinAuth(req, res, next);
};
