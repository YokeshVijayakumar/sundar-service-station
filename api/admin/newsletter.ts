import type { VercelRequest, VercelResponse } from '@vercel/node';
import { connectToDatabase } from '../lib/mongodb';
import { authenticateAdmin } from '../lib/auth';
import { ObjectId } from 'mongodb';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  const admin = authenticateAdmin(req);
  if (!admin) {
    return res.status(401).json({ success: false, error: 'Unauthorized' });
  }

  const { db } = await connectToDatabase();
  const collection = db.collection('newsletter_subscribers');

  try {
    if (req.method === 'GET') {
      const subscribers = await collection.find({}).sort({ subscribedAt: -1 }).toArray();
      return res.status(200).json({ success: true, data: subscribers });
    }

    if (req.method === 'DELETE') {
      const { _id } = req.body;
      if (!_id) {
        return res.status(400).json({ success: false, error: 'Subscriber _id is required' });
      }
      await collection.deleteOne({ _id: new ObjectId(_id) });
      return res.status(200).json({ success: true, message: 'Subscriber removed' });
    }

    return res.status(405).json({ success: false, error: 'Method not allowed' });
  } catch (error) {
    console.error('Admin newsletter error:', error);
    return res.status(500).json({ success: false, error: 'Operation failed' });
  }
}
