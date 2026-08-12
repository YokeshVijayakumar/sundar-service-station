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
  const collection = db.collection('testimonials');

  try {
    if (req.method === 'GET') {
      const testimonials = await collection.find({}).sort({ createdAt: -1 }).toArray();
      // Also fetch pending feedback
      const feedback = await db.collection('feedback').find({}).sort({ createdAt: -1 }).toArray();
      return res.status(200).json({
        success: true,
        data: { testimonials, feedback },
      });
    }

    if (req.method === 'POST') {
      const testimonial = {
        ...req.body,
        source: req.body.source || 'manual',
        isApproved: req.body.isApproved !== false,
        createdAt: new Date().toISOString(),
      };
      const result = await collection.insertOne(testimonial);
      return res.status(201).json({
        success: true,
        data: { ...testimonial, _id: result.insertedId },
      });
    }

    if (req.method === 'PUT') {
      const { _id, promoteFeedbackId, ...updateData } = req.body;

      // Special case: promote feedback to testimonial
      if (promoteFeedbackId) {
        const feedback = await db.collection('feedback').findOne({
          _id: new ObjectId(promoteFeedbackId),
        });
        if (!feedback) {
          return res.status(404).json({ success: false, error: 'Feedback not found' });
        }

        const testimonial = {
          name: feedback.name,
          location: '',
          rating: feedback.rating,
          service: feedback.service,
          image: '',
          text: feedback.feedback,
          date: new Date().toLocaleDateString('en-US', {
            month: 'long', day: 'numeric', year: 'numeric',
          }),
          source: 'feedback' as const,
          isApproved: true,
          createdAt: new Date().toISOString(),
        };
        await collection.insertOne(testimonial);
        await db.collection('feedback').updateOne(
          { _id: new ObjectId(promoteFeedbackId) },
          { $set: { status: 'approved', promotedToTestimonial: true } }
        );
        return res.status(200).json({ success: true, message: 'Feedback promoted to testimonial' });
      }

      if (!_id) {
        return res.status(400).json({ success: false, error: 'Testimonial _id is required' });
      }
      await collection.updateOne(
        { _id: new ObjectId(_id) },
        { $set: updateData }
      );
      return res.status(200).json({ success: true, message: 'Testimonial updated' });
    }

    if (req.method === 'DELETE') {
      const { _id } = req.body;
      if (!_id) {
        return res.status(400).json({ success: false, error: 'Testimonial _id is required' });
      }
      await collection.deleteOne({ _id: new ObjectId(_id) });
      return res.status(200).json({ success: true, message: 'Testimonial deleted' });
    }

    return res.status(405).json({ success: false, error: 'Method not allowed' });
  } catch (error) {
    console.error('Admin testimonials error:', error);
    return res.status(500).json({ success: false, error: 'Operation failed' });
  }
}
