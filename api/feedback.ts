import type { VercelRequest, VercelResponse } from '@vercel/node';
import { connectToDatabase } from './lib/mongodb';

const PLACE_ID = process.env.GOOGLE_PLACE_ID || '';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ success: false, error: 'Method not allowed' });
  }

  try {
    const { name, email, rating, service, feedback } = req.body;

    if (!name || !email || !rating || !feedback) {
      return res.status(400).json({
        success: false,
        error: 'Name, email, rating, and feedback are required',
      });
    }

    if (rating < 1 || rating > 5) {
      return res.status(400).json({
        success: false,
        error: 'Rating must be between 1 and 5',
      });
    }

    const { db } = await connectToDatabase();
    const feedbackDoc = {
      name,
      email,
      rating: Number(rating),
      service: service || '',
      feedback,
      status: 'pending',
      promotedToTestimonial: false,
      createdAt: new Date().toISOString(),
    };

    await db.collection('feedback').insertOne(feedbackDoc);

    // Build Google Review URL for redirect
    const googleReviewUrl = PLACE_ID
      ? `https://search.google.com/local/writereview?placeid=${PLACE_ID}`
      : null;

    return res.status(201).json({
      success: true,
      message: 'Thank you for your feedback!',
      googleReviewUrl,
    });
  } catch (error) {
    console.error('Error submitting feedback:', error);
    return res.status(500).json({ success: false, error: 'Failed to submit feedback' });
  }
}
