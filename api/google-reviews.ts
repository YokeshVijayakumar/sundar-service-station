import type { VercelRequest, VercelResponse } from '@vercel/node';
import { connectToDatabase } from './lib/mongodb';

const GOOGLE_API_KEY = process.env.GOOGLE_PLACES_API_KEY || '';
const PLACE_ID = process.env.GOOGLE_PLACE_ID || '';
const CACHE_DURATION_MS = 6 * 60 * 60 * 1000; // 6 hours

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'GET') {
    return res.status(405).json({ success: false, error: 'Method not allowed' });
  }

  try {
    const { db } = await connectToDatabase();
    const cacheCollection = db.collection('google_reviews_cache');

    // Check cache first
    const cached = await cacheCollection.findOne({ placeId: PLACE_ID });
    if (cached) {
      const lastFetched = new Date(cached.lastFetched).getTime();
      if (Date.now() - lastFetched < CACHE_DURATION_MS) {
        return res.status(200).json({ success: true, data: cached, fromCache: true });
      }
    }

    // If no API key or place ID configured, return cache or empty
    if (!GOOGLE_API_KEY || !PLACE_ID) {
      return res.status(200).json({
        success: true,
        data: cached || { reviews: [], overallRating: 0, totalReviewCount: 0 },
        message: 'Google Places API not configured',
      });
    }

    // Fetch fresh reviews from Google Places API (New)
    const url = `https://places.googleapis.com/v1/places/${PLACE_ID}`;
    const response = await fetch(url, {
      headers: {
        'Content-Type': 'application/json',
        'X-Goog-Api-Key': GOOGLE_API_KEY,
        'X-Goog-FieldMask': 'reviews,rating,userRatingCount',
      },
    });

    if (!response.ok) {
      // Return cached data if API fails
      if (cached) {
        return res.status(200).json({ success: true, data: cached, fromCache: true });
      }
      throw new Error(`Google API returned ${response.status}`);
    }

    const data = await response.json();
    const reviewData = {
      placeId: PLACE_ID,
      overallRating: data.rating || 0,
      totalReviewCount: data.userRatingCount || 0,
      reviews: (data.reviews || []).map((r: any) => ({
        authorName: r.authorAttribution?.displayName || 'Anonymous',
        authorPhoto: r.authorAttribution?.photoUri || '',
        rating: r.rating || 0,
        text: r.text?.text || '',
        relativeTime: r.relativePublishTimeDescription || '',
        publishTime: r.publishTime || '',
      })),
      lastFetched: new Date().toISOString(),
    };

    // Update cache
    await cacheCollection.updateOne(
      { placeId: PLACE_ID },
      { $set: reviewData },
      { upsert: true }
    );

    return res.status(200).json({ success: true, data: reviewData, fromCache: false });
  } catch (error) {
    console.error('Error fetching Google reviews:', error);
    return res.status(500).json({ success: false, error: 'Failed to fetch Google reviews' });
  }
}
