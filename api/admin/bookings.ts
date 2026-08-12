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
  const collection = db.collection('bookings');

  try {
    if (req.method === 'GET') {
      const bookings = await collection.find({}).sort({ createdAt: -1 }).toArray();
      return res.status(200).json({ success: true, data: bookings });
    }

    if (req.method === 'PUT') {
      const { _id, status } = req.body;
      if (!_id || !status) {
        return res.status(400).json({ success: false, error: 'Booking _id and status are required' });
      }
      const validStatuses = ['pending', 'confirmed', 'completed', 'cancelled'];
      if (!validStatuses.includes(status)) {
        return res.status(400).json({ success: false, error: 'Invalid status' });
      }
      await collection.updateOne(
        { _id: new ObjectId(_id) },
        { $set: { status, updatedAt: new Date().toISOString() } }
      );
      return res.status(200).json({ success: true, message: 'Booking status updated' });
    }

    return res.status(405).json({ success: false, error: 'Method not allowed' });
  } catch (error) {
    console.error('Admin bookings error:', error);
    return res.status(500).json({ success: false, error: 'Operation failed' });
  }
}
