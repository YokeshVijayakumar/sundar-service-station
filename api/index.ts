import type { VercelRequest, VercelResponse } from '@vercel/node';
import { connectToDatabase } from './lib/mongodb.js';
import { authenticateAdmin } from './lib/auth.js';
import { generateSignature, deleteImage } from './lib/cloudinary.js';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  const url = req.url || '';
  const cleanUrl = url.split('?')[0];

  // Enable CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  try {
    const { db } = await connectToDatabase();
    const body = (typeof req.body === 'string' && req.body.trim() !== '') ? JSON.parse(req.body) : (req.body || {});

    // GET /api/services
    if (cleanUrl.endsWith('/services') && req.method === 'GET') {
      const services = await db.collection('services').find({ isActive: true }).sort({ sortOrder: 1 }).toArray();
      return res.status(200).json({
        success: true,
        data: {
          mainServices: services.filter(s => s.category === 'main'),
          additionalServices: services.filter(s => s.category === 'additional'),
        },
      });
    }

    // GET /api/testimonials
    if (cleanUrl.endsWith('/testimonials') && req.method === 'GET') {
      const testimonials = await db.collection('testimonials').find({ isApproved: true }).sort({ createdAt: -1 }).toArray();
      return res.status(200).json({ success: true, data: testimonials });
    }

    // GET /api/blog-posts
    if (cleanUrl.endsWith('/blog-posts') && req.method === 'GET') {
      const posts = await db.collection('blog_posts').find({ isPublished: true }).sort({ createdAt: -1 }).toArray();
      return res.status(200).json({ success: true, data: posts });
    }

    // GET /api/site-config
    if (cleanUrl.endsWith('/site-config') && req.method === 'GET') {
      const configs = await db.collection('site_config').find({}).toArray();
      const siteConfig: Record<string, any> = {};
      for (const config of configs) {
        siteConfig[config.section] = config.data;
      }
      return res.status(200).json({ success: true, data: siteConfig });
    }

    // GET /api/stats
    if (cleanUrl.endsWith('/stats') && req.method === 'GET') {
      const stats = await db.collection('stats').find({}).sort({ sortOrder: 1 }).toArray();
      return res.status(200).json({ success: true, data: stats });
    }

    // POST /api/bookings
    if (cleanUrl.endsWith('/bookings') && req.method === 'POST') {
      const { name, email, phone, service, vehicle, preferredDate, preferredTime, message } = body;
      if (!name || !email || !phone || !service) {
        return res.status(400).json({ success: false, error: 'Required fields missing' });
      }
      const booking = {
        name, email, phone, service, vehicle: vehicle || '',
        preferredDate: preferredDate || '', preferredTime: preferredTime || '',
        message: message || '', status: 'pending', createdAt: new Date().toISOString(),
      };
      const result = await db.collection('bookings').insertOne(booking);
      return res.status(201).json({ success: true, data: { ...booking, _id: result.insertedId } });
    }

    // POST /api/newsletter
    if (cleanUrl.endsWith('/newsletter') && req.method === 'POST') {
      const { email } = body;
      if (!email || !email.includes('@')) {
        return res.status(400).json({ success: false, error: 'Valid email required' });
      }
      const collection = db.collection('newsletter_subscribers');
      const existing = await collection.findOne({ email: email.toLowerCase() });
      if (existing) {
        if (!existing.isActive) {
          await collection.updateOne({ email: email.toLowerCase() }, { $set: { isActive: true } });
        }
        return res.status(200).json({ success: true, message: 'Subscribed!' });
      }
      await collection.insertOne({ email: email.toLowerCase(), subscribedAt: new Date().toISOString(), isActive: true });
      return res.status(201).json({ success: true, message: 'Successfully subscribed!' });
    }

    // POST /api/feedback
    if (cleanUrl.endsWith('/feedback') && req.method === 'POST') {
      const { name, email, rating, service, feedback } = body;
      if (!name || !email || !rating || !feedback) {
        return res.status(400).json({ success: false, error: 'Missing required feedback fields' });
      }
      await db.collection('feedback').insertOne({
        name, email, rating: Number(rating), service: service || '', feedback,
        status: 'pending', promotedToTestimonial: false, createdAt: new Date().toISOString(),
      });
      return res.status(201).json({ success: true, message: 'Thank you for your feedback!' });
    }

    // POST/DELETE /api/upload (Cloudinary)
    if (cleanUrl.endsWith('/upload')) {
      const admin = authenticateAdmin(req);
      if (!admin) return res.status(401).json({ success: false, error: 'Unauthorized' });

      if (req.method === 'POST') {
        const { folder } = body;
        const signatureData = generateSignature(folder || 'sundar_service_station');
        return res.status(200).json({ success: true, data: signatureData });
      }
      if (req.method === 'DELETE') {
        const { publicId } = body;
        const result = await deleteImage(publicId);
        return res.status(200).json({ success: true, data: result });
      }
    }

    return res.status(404).json({ success: false, error: 'Route not found' });
  } catch (error) {
    console.error('Public API Error:', error);
    return res.status(500).json({ success: false, error: 'Internal Server Error' });
  }
}
