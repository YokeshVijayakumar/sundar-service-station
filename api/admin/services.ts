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
  const collection = db.collection('services');

  try {
    // GET - List all services (including inactive)
    if (req.method === 'GET') {
      const services = await collection.find({}).sort({ sortOrder: 1 }).toArray();
      return res.status(200).json({ success: true, data: services });
    }

    // POST - Create new service
    if (req.method === 'POST') {
      const service = {
        ...req.body,
        isActive: req.body.isActive !== false,
        popular: req.body.popular || false,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      const result = await collection.insertOne(service);
      return res.status(201).json({
        success: true,
        data: { ...service, _id: result.insertedId },
      });
    }

    // PUT - Update service
    if (req.method === 'PUT') {
      const { _id, ...updateData } = req.body;
      if (!_id) {
        return res.status(400).json({ success: false, error: 'Service _id is required' });
      }
      updateData.updatedAt = new Date().toISOString();
      await collection.updateOne(
        { _id: new ObjectId(_id) },
        { $set: updateData }
      );
      return res.status(200).json({ success: true, message: 'Service updated' });
    }

    // DELETE - Soft delete (set isActive to false)
    if (req.method === 'DELETE') {
      const { _id } = req.body;
      if (!_id) {
        return res.status(400).json({ success: false, error: 'Service _id is required' });
      }
      await collection.updateOne(
        { _id: new ObjectId(_id) },
        { $set: { isActive: false, updatedAt: new Date().toISOString() } }
      );
      return res.status(200).json({ success: true, message: 'Service deactivated' });
    }

    return res.status(405).json({ success: false, error: 'Method not allowed' });
  } catch (error) {
    console.error('Admin services error:', error);
    return res.status(500).json({ success: false, error: 'Operation failed' });
  }
}
