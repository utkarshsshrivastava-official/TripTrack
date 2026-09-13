import { Request, Response } from 'express';
import { TravellerModel } from '../../models/traveller.model';
import { TRAVELLERS_CONFIG } from '../../shared/config/travellers.config';

/**
 * GET /api/travellers
 * Retrieve all travellers from MongoDB. Auto-seeds if collection is empty.
 */
export async function getTravellers(req: Request, res: Response): Promise<void> {
  try {
    let travellers = await TravellerModel.find().lean();

    if (!travellers || travellers.length === 0) {
      // Auto-seed collection from default seeds
      await TravellerModel.insertMany(TRAVELLERS_CONFIG);
      travellers = await TravellerModel.find().lean();
    }

    res.json({
      success: true,
      count: travellers.length,
      data: travellers
    });
  } catch (error: any) {
    console.warn('[TravellerController] MongoDB fetch failed, falling back to in-memory config:', error.message);
    // Offline / unconfigured DB resilience fallback
    res.json({
      success: true,
      count: TRAVELLERS_CONFIG.length,
      data: TRAVELLERS_CONFIG,
      warning: 'Operating on fallback in-memory config'
    });
  }
}

/**
 * PUT /api/travellers/:id
 * Update an existing traveller's details (e.g. meds, emergency phone, blood group)
 */
export async function updateTraveller(req: Request, res: Response): Promise<void> {
  try {
    const { id } = req.params;
    const updateData = req.body;

    const updated = await TravellerModel.findOneAndUpdate(
      { id },
      { $set: updateData },
      { new: true, upsert: true }
    ).lean();

    res.json({
      success: true,
      data: updated
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      error: error.message || 'Failed to update traveller profile'
    });
  }
}

/**
 * POST /api/travellers/seed
 * Seed / reset the travellers collection
 */
export async function seedTravellers(req: Request, res: Response): Promise<void> {
  try {
    const customSeeds = req.body && Array.isArray(req.body) && req.body.length > 0 ? req.body : TRAVELLERS_CONFIG;

    await TravellerModel.deleteMany({});
    const inserted = await TravellerModel.insertMany(customSeeds);

    res.json({
      success: true,
      message: 'Travellers collection successfully seeded',
      count: inserted.length,
      data: inserted
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      error: error.message || 'Failed to seed travellers collection'
    });
  }
}
