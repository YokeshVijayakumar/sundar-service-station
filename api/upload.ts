import type { VercelRequest, VercelResponse } from '@vercel/node';
import { authenticateAdmin } from './lib/auth';
import { generateSignature, deleteImage } from './lib/cloudinary';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  const admin = authenticateAdmin(req);
  if (!admin) {
    return res.status(401).json({ success: false, error: 'Unauthorized' });
  }

  if (req.method === 'POST') {
    try {
      const { folder } = req.body;
      const signatureData = generateSignature(folder || 'sundar_service_station');
      return res.status(200).json({ success: true, data: signatureData });
    } catch (error) {
      console.error('Error generating upload signature:', error);
      return res.status(500).json({ success: false, error: 'Failed to generate upload signature' });
    }
  }

  if (req.method === 'DELETE') {
    try {
      const { publicId } = req.body;
      if (!publicId) {
        return res.status(400).json({ success: false, error: 'publicId is required' });
      }
      const result = await deleteImage(publicId);
      return res.status(200).json({ success: true, data: result });
    } catch (error) {
      console.error('Error deleting image:', error);
      return res.status(500).json({ success: false, error: 'Failed to delete image' });
    }
  }

  return res.status(405).json({ success: false, error: 'Method not allowed' });
}
