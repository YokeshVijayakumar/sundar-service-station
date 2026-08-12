import type { VercelRequest, VercelResponse } from '@vercel/node';
import { connectToDatabase } from './lib/mongodb';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ success: false, error: 'Method not allowed' });
  }

  try {
    const { name, email, phone, service, vehicle, preferredDate, preferredTime, message } = req.body;

    // Validation
    if (!name || !email || !phone || !service) {
      return res.status(400).json({
        success: false,
        error: 'Name, email, phone, and service are required',
      });
    }

    const { db } = await connectToDatabase();
    const booking = {
      name,
      email,
      phone,
      service,
      vehicle: vehicle || '',
      preferredDate: preferredDate || '',
      preferredTime: preferredTime || '',
      message: message || '',
      status: 'pending',
      createdAt: new Date().toISOString(),
    };

    const result = await db.collection('bookings').insertOne(booking);

    return res.status(201).json({
      success: true,
      data: { ...booking, _id: result.insertedId },
      message: 'Booking request submitted successfully!',
    });
  } catch (error) {
    console.error('Error creating booking:', error);
    return res.status(500).json({ success: false, error: 'Failed to submit booking' });
  }
}
