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
  const collection = db.collection('blog_posts');

  try {
    if (req.method === 'GET') {
      const posts = await collection.find({}).sort({ createdAt: -1 }).toArray();
      return res.status(200).json({ success: true, data: posts });
    }

    if (req.method === 'POST') {
      const slug = req.body.title
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)/g, '');
      const post = {
        ...req.body,
        slug,
        isPublished: req.body.isPublished !== false,
        isFeatured: req.body.isFeatured || false,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      const result = await collection.insertOne(post);
      return res.status(201).json({
        success: true,
        data: { ...post, _id: result.insertedId },
      });
    }

    if (req.method === 'PUT') {
      const { _id, ...updateData } = req.body;
      if (!_id) {
        return res.status(400).json({ success: false, error: 'Post _id is required' });
      }
      if (updateData.title) {
        updateData.slug = updateData.title
          .toLowerCase()
          .replace(/[^a-z0-9]+/g, '-')
          .replace(/(^-|-$)/g, '');
      }
      updateData.updatedAt = new Date().toISOString();
      await collection.updateOne(
        { _id: new ObjectId(_id) },
        { $set: updateData }
      );
      return res.status(200).json({ success: true, message: 'Blog post updated' });
    }

    if (req.method === 'DELETE') {
      const { _id } = req.body;
      if (!_id) {
        return res.status(400).json({ success: false, error: 'Post _id is required' });
      }
      await collection.deleteOne({ _id: new ObjectId(_id) });
      return res.status(200).json({ success: true, message: 'Blog post deleted' });
    }

    return res.status(405).json({ success: false, error: 'Method not allowed' });
  } catch (error) {
    console.error('Admin blog posts error:', error);
    return res.status(500).json({ success: false, error: 'Operation failed' });
  }
}
