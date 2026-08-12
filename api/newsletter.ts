import type { VercelRequest, VercelResponse } from '@vercel/node';
import { connectToDatabase } from './lib/mongodb';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ success: false, error: 'Method not allowed' });
  }

  try {
    const { email } = req.body;

    if (!email || !email.includes('@')) {
      return res.status(400).json({
        success: false,
        error: 'Valid email address is required',
      });
    }

    const { db } = await connectToDatabase();
    const collection = db.collection('newsletter_subscribers');

    // Check for duplicate
    const existing = await collection.findOne({ email: email.toLowerCase() });
    if (existing) {
      if (existing.isActive) {
        return res.status(200).json({
          success: true,
          message: 'You are already subscribed!',
        });
      }
      // Re-activate
      await collection.updateOne(
        { email: email.toLowerCase() },
        { $set: { isActive: true, subscribedAt: new Date().toISOString() } }
      );
      return res.status(200).json({
        success: true,
        message: 'Welcome back! You have been re-subscribed.',
      });
    }

    await collection.insertOne({
      email: email.toLowerCase(),
      subscribedAt: new Date().toISOString(),
      isActive: true,
    });

    return res.status(201).json({
      success: true,
      message: 'Successfully subscribed to our newsletter!',
    });
  } catch (error) {
    console.error('Error subscribing to newsletter:', error);
    return res.status(500).json({ success: false, error: 'Failed to subscribe' });
  }
}
