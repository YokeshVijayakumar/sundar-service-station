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
  const collection = db.collection('stats');

  try {
    if (req.method === 'GET') {
      const stats = await collection.find({}).sort({ sortOrder: 1 }).toArray();
      return res.status(200).json({ success: true, data: stats });
    }

    if (req.method === 'PUT') {
      const { _id, ...updateData } = req.body;
      if (!_id) {
        return res.status(400).json({ success: false, error: 'Stat _id is required' });
      }
      await collection.updateOne(
        { _id: new ObjectId(_id) },
        { $set: updateData }
      );
      return res.status(200).json({ success: true, message: 'Stat updated' });
    }

    return res.status(405).json({ success: false, error: 'Method not allowed' });
  } catch (error) {
    console.error('Admin stats error:', error);
    return res.status(500).json({ success: false, error: 'Operation failed' });
  }
}
