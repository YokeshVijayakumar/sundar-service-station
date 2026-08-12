import type { VercelRequest, VercelResponse } from '@vercel/node';
import { connectToDatabase } from '../lib/mongodb';
import { authenticateAdmin } from '../lib/auth';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  const admin = authenticateAdmin(req);
  if (!admin) {
    return res.status(401).json({ success: false, error: 'Unauthorized' });
  }

  const { db } = await connectToDatabase();
  const collection = db.collection('site_config');

  try {
    if (req.method === 'GET') {
      const configs = await collection.find({}).toArray();
      const siteConfig: Record<string, any> = {};
      for (const config of configs) {
        siteConfig[config.section] = config.data;
      }
      return res.status(200).json({ success: true, data: siteConfig });
    }

    if (req.method === 'PUT') {
      const { section, data } = req.body;
      if (!section || !data) {
        return res.status(400).json({ success: false, error: 'Section and data are required' });
      }
      await collection.updateOne(
        { section },
        { $set: { data, updatedAt: new Date().toISOString() } },
        { upsert: true }
      );
      return res.status(200).json({ success: true, message: `${section} config updated` });
    }

    return res.status(405).json({ success: false, error: 'Method not allowed' });
  } catch (error) {
    console.error('Admin site config error:', error);
    return res.status(500).json({ success: false, error: 'Operation failed' });
  }
}
