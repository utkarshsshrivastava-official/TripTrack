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

  const providedPin = req.headers['x-family-pin'] || req.query.pin;

  if (!providedPin) {
    res.status(401).json({
      success: false,
      error: 'Unauthorized: Missing x-family-pin header. Please provide the 4-digit family PIN.'
    });
    return;
  }

  if (providedPin !== configuredPin) {
    res.status(403).json({
      success: false,
      error: 'Forbidden: Invalid family PIN.'
    });
    return;
  }

  next();
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
