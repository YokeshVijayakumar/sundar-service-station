import type { VercelRequest, VercelResponse } from '@vercel/node';
import { connectToDatabase } from './lib/mongodb';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'GET') {
    return res.status(405).json({ success: false, error: 'Method not allowed' });
  }

  try {
    const { db } = await connectToDatabase();
    const services = await db
      .collection('services')
      .find({ isActive: true })
      .sort({ sortOrder: 1 })
      .toArray();

    const mainServices = services.filter(s => s.category === 'main');
    const additionalServices = services.filter(s => s.category === 'additional');

    return res.status(200).json({
      success: true,
      data: { mainServices, additionalServices },
    });
  } catch (error) {
    console.error('Error fetching services:', error);
    return res.status(500).json({ success: false, error: 'Failed to fetch services' });
  }
}
