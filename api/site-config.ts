import type { VercelRequest, VercelResponse } from '@vercel/node';
import { connectToDatabase } from './lib/mongodb';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'GET') {
    return res.status(405).json({ success: false, error: 'Method not allowed' });
  }

  try {
    const { db } = await connectToDatabase();
    const configs = await db.collection('site_config').find({}).toArray();

    // Merge all config sections into a single object
    const siteConfig: Record<string, any> = {};
    for (const config of configs) {
      siteConfig[config.section] = config.data;
    }

    return res.status(200).json({
      success: true,
      data: siteConfig,
    });
  } catch (error) {
    console.error('Error fetching site config:', error);
    return res.status(500).json({ success: false, error: 'Failed to fetch site config' });
  }
}
