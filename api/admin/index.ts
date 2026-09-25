import type { VercelRequest, VercelResponse } from '@vercel/node';
import { connectToDatabase } from '../lib/mongodb.js';
import { generateToken, authenticateAdmin } from '../lib/auth.js';
import bcrypt from 'bcryptjs';
import { ObjectId } from 'mongodb';

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

    // POST /api/admin/auth (Login)
    if (cleanUrl.endsWith('/auth') && req.method === 'POST') {
      const { username, password } = body;
      if (!username || !password) {
        return res.status(400).json({ success: false, error: 'Username and password required' });
      }

      const adminCollection = db.collection('admin_users');
      let user = await adminCollection.findOne({ username });

      // Auto-initialize default admin user if admin_users collection is empty
      if (!user) {
        const userCount = await adminCollection.countDocuments();
        if (userCount === 0) {
          const defaultPassword = process.env.ADMIN_DEFAULT_PASSWORD || 'admin123';
          const defaultHash = await bcrypt.hash(defaultPassword, 10);
          const newUser = {
            username: 'admin',
            passwordHash: defaultHash,
            createdAt: new Date().toISOString(),
          };
          const insertRes = await adminCollection.insertOne(newUser);
          if (username === 'admin') {
            user = { ...newUser, _id: insertRes.insertedId };
          }
        }
      }

      if (!user) {
        return res.status(401).json({ success: false, error: 'Invalid credentials' });
      }

      const isValid = await bcrypt.compare(password, user.passwordHash);
      if (!isValid) {
        return res.status(401).json({ success: false, error: 'Invalid credentials' });
      }

      const token = generateToken(user._id.toString(), user.username);
      await adminCollection.updateOne({ _id: user._id }, { $set: { lastLogin: new Date().toISOString() } });
      return res.status(200).json({ success: true, data: { token, username: user.username } });
    }

    // All other admin routes require JWT authentication
    const admin = authenticateAdmin(req);
    if (!admin) {
      return res.status(401).json({ success: false, error: 'Unauthorized' });
    }

    // Admin Services
    if (cleanUrl.endsWith('/services')) {
      const collection = db.collection('services');
      if (req.method === 'GET') {
        const services = await collection.find({}).sort({ sortOrder: 1 }).toArray();
        return res.status(200).json({ success: true, data: services });
      }
      if (req.method === 'POST') {
        const service = { ...req.body, isActive: req.body.isActive !== false, popular: req.body.popular || false, createdAt: new Date().toISOString() };
        const result = await collection.insertOne(service);
        return res.status(201).json({ success: true, data: { ...service, _id: result.insertedId } });
      }
      if (req.method === 'PUT') {
        const { _id, ...updateData } = req.body;
        await collection.updateOne({ _id: new ObjectId(_id) }, { $set: { ...updateData, updatedAt: new Date().toISOString() } });
        return res.status(200).json({ success: true, message: 'Service updated' });
      }
      if (req.method === 'DELETE') {
        const { _id } = req.body;
        await collection.updateOne({ _id: new ObjectId(_id) }, { $set: { isActive: false } });
        return res.status(200).json({ success: true, message: 'Service deactivated' });
      }
    }

    // Admin Blog Posts
    if (cleanUrl.endsWith('/blog-posts')) {
      const collection = db.collection('blog_posts');
      if (req.method === 'GET') {
        const posts = await collection.find({}).sort({ createdAt: -1 }).toArray();
        return res.status(200).json({ success: true, data: posts });
      }
      if (req.method === 'POST') {
        const slug = req.body.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
        const post = { ...req.body, slug, isPublished: req.body.isPublished !== false, createdAt: new Date().toISOString() };
        const result = await collection.insertOne(post);
        return res.status(201).json({ success: true, data: { ...post, _id: result.insertedId } });
      }
      if (req.method === 'PUT') {
        const { _id, ...updateData } = req.body;
        await collection.updateOne({ _id: new ObjectId(_id) }, { $set: { ...updateData, updatedAt: new Date().toISOString() } });
        return res.status(200).json({ success: true, message: 'Blog post updated' });
      }
      if (req.method === 'DELETE') {
        const { _id } = req.body;
        await collection.deleteOne({ _id: new ObjectId(_id) });
        return res.status(200).json({ success: true, message: 'Blog post deleted' });
      }
    }

    // Admin Testimonials
    if (cleanUrl.endsWith('/testimonials')) {
      const collection = db.collection('testimonials');
      if (req.method === 'GET') {
        const testimonials = await collection.find({}).sort({ createdAt: -1 }).toArray();
        const feedback = await db.collection('feedback').find({}).sort({ createdAt: -1 }).toArray();
        return res.status(200).json({ success: true, data: { testimonials, feedback } });
      }
      if (req.method === 'POST') {
        const testimonial = { ...req.body, source: req.body.source || 'manual', isApproved: true, createdAt: new Date().toISOString() };
        const result = await collection.insertOne(testimonial);
        return res.status(201).json({ success: true, data: { ...testimonial, _id: result.insertedId } });
      }
      if (req.method === 'PUT') {
        const { _id, promoteFeedbackId, ...updateData } = req.body;
        if (promoteFeedbackId) {
          const feedbackDoc = await db.collection('feedback').findOne({ _id: new ObjectId(promoteFeedbackId) });
          if (feedbackDoc) {
            await collection.insertOne({
              name: feedbackDoc.name, location: '', rating: feedbackDoc.rating, service: feedbackDoc.service,
              image: '', text: feedbackDoc.feedback, date: 'Recently', source: 'feedback', isApproved: true, createdAt: new Date().toISOString()
            });
            await db.collection('feedback').updateOne({ _id: new ObjectId(promoteFeedbackId) }, { $set: { status: 'approved', promotedToTestimonial: true } });
          }
          return res.status(200).json({ success: true, message: 'Promoted feedback to testimonial' });
        }
        await collection.updateOne({ _id: new ObjectId(_id) }, { $set: updateData });
        return res.status(200).json({ success: true, message: 'Testimonial updated' });
      }
      if (req.method === 'DELETE') {
        const { _id } = req.body;
        await collection.deleteOne({ _id: new ObjectId(_id) });
        return res.status(200).json({ success: true, message: 'Testimonial deleted' });
      }
    }

    // Admin Site Config
    if (cleanUrl.endsWith('/site-config')) {
      const collection = db.collection('site_config');
      if (req.method === 'GET') {
        const configs = await collection.find({}).toArray();
        const siteConfig: Record<string, any> = {};
        for (const config of configs) { siteConfig[config.section] = config.data; }
        return res.status(200).json({ success: true, data: siteConfig });
      }
      if (req.method === 'PUT') {
        const { section, data } = req.body;
        await collection.updateOne({ section }, { $set: { data, updatedAt: new Date().toISOString() } }, { upsert: true });
        return res.status(200).json({ success: true, message: `${section} updated` });
      }
    }

    // Admin Bookings
    if (cleanUrl.endsWith('/bookings')) {
      const collection = db.collection('bookings');
      if (req.method === 'GET') {
        const bookings = await collection.find({}).sort({ createdAt: -1 }).toArray();
        return res.status(200).json({ success: true, data: bookings });
      }
      if (req.method === 'PUT') {
        const { _id, status } = req.body;
        await collection.updateOne({ _id: new ObjectId(_id) }, { $set: { status, updatedAt: new Date().toISOString() } });
        return res.status(200).json({ success: true, message: 'Booking status updated' });
      }
    }

    // Admin Newsletter
    if (cleanUrl.endsWith('/newsletter')) {
      const collection = db.collection('newsletter_subscribers');
      if (req.method === 'GET') {
        const subscribers = await collection.find({}).sort({ subscribedAt: -1 }).toArray();
        return res.status(200).json({ success: true, data: subscribers });
      }
      if (req.method === 'DELETE') {
        const { _id } = req.body;
        await collection.deleteOne({ _id: new ObjectId(_id) });
        return res.status(200).json({ success: true, message: 'Subscriber deleted' });
      }
    }

    return res.status(404).json({ success: false, error: 'Admin route not found' });
  } catch (error) {
    console.error('Admin API Error:', error);
    return res.status(500).json({ success: false, error: 'Internal Server Error' });
  }
}
