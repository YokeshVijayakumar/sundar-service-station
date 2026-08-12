import { MongoClient } from 'mongodb';
import bcrypt from 'bcryptjs';
import dotenv from 'dotenv';
import path from 'path';
import dns from 'dns';

// Fix for Windows DNS resolution of mongodb+srv URLs
dns.setServers(['8.8.8.8', '1.1.1.1']);

// Load environment variables from .env.local
dotenv.config({ path: path.resolve(process.cwd(), '.env.local') });

const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
  console.error('❌ MONGODB_URI environment variable is missing!');
  process.exit(1);
}

const DB_NAME = 'sundar_service_station';

const services = [
  {
    serviceId: 'ceramic-coating',
    name: 'Ceramic Coating',
    icon: 'Shield',
    price: 'From $800',
    duration: '4-6 hours',
    image: 'https://images.pexels.com/photos/3354648/pexels-photo-3354648.jpeg?auto=compress&cs=tinysrgb&w=800&h=600&fit=crop',
    description: 'Professional ceramic coating for ultimate paint protection and gloss.',
    features: [
      '9H Hardness Protection',
      '5-Year Warranty',
      'Hydrophobic Properties',
      'UV Protection',
      'Enhanced Gloss',
      'Easy Maintenance'
    ],
    popular: true,
    category: 'main',
    sortOrder: 1,
    isActive: true,
    createdAt: new Date().toISOString()
  },
  {
    serviceId: 'paint-protection',
    name: 'Paint Protection Film',
    icon: 'Car',
    price: 'From $1,200',
    duration: '6-8 hours',
    image: 'https://images.pexels.com/photos/3311574/pexels-photo-3311574.jpeg?auto=compress&cs=tinysrgb&w=800&h=600&fit=crop',
    description: 'Invisible protection film that preserves your paint from chips and scratches.',
    features: [
      'Self-Healing Technology',
      '10-Year Warranty',
      'Invisible Protection',
      'Stain Resistant',
      'Professional Installation',
      'Maintains Resale Value'
    ],
    popular: false,
    category: 'main',
    sortOrder: 2,
    isActive: true,
    createdAt: new Date().toISOString()
  },
  {
    serviceId: 'interior-cleaning',
    name: 'Interior Deep Clean',
    icon: 'Sparkles',
    price: 'From $200',
    duration: '2-3 hours',
    image: 'https://images.pexels.com/photos/6870318/pexels-photo-6870318.jpeg?auto=compress&cs=tinysrgb&w=800&h=600&fit=crop',
    description: 'Complete interior detailing including leather treatment and fabric protection.',
    features: [
      'Steam Cleaning',
      'Leather Conditioning',
      'Fabric Protection',
      'Odor Elimination',
      'Dashboard Treatment',
      'Window Cleaning'
    ],
    popular: false,
    category: 'main',
    sortOrder: 3,
    isActive: true,
    createdAt: new Date().toISOString()
  },
  {
    serviceId: 'full-detail',
    name: 'Complete Detail Package',
    icon: 'Droplets',
    price: 'From $400',
    duration: '4-5 hours',
    image: 'https://images.pexels.com/photos/3422964/pexels-photo-3422964.jpeg?auto=compress&cs=tinysrgb&w=800&h=600&fit=crop',
    description: 'Comprehensive exterior and interior detailing for the ultimate finish.',
    features: [
      'Exterior Wash & Wax',
      'Paint Correction',
      'Interior Deep Clean',
      'Tire & Wheel Treatment',
      'Engine Bay Detailing',
      'Final Inspection'
    ],
    popular: false,
    category: 'main',
    sortOrder: 4,
    isActive: true,
    createdAt: new Date().toISOString()
  },
  {
    serviceId: 'headlight-restoration',
    name: 'Headlight Restoration',
    icon: 'Car',
    price: 'From $80',
    duration: '1 hour',
    image: '',
    description: 'Crystal clear headlight restoration',
    features: ['UV Oxidation Removal', 'Polymer Sealant', 'Clarity Restoration'],
    popular: false,
    category: 'additional',
    sortOrder: 5,
    isActive: true,
    createdAt: new Date().toISOString()
  },
  {
    serviceId: 'engine-bay-cleaning',
    name: 'Engine Bay Cleaning',
    icon: 'Sparkles',
    price: 'From $120',
    duration: '1-2 hours',
    image: '',
    description: 'Professional engine compartment detailing',
    features: ['Degreasing', 'Steam Rinse', 'Vinyl & Rubber Dressing'],
    popular: false,
    category: 'additional',
    sortOrder: 6,
    isActive: true,
    createdAt: new Date().toISOString()
  },
  {
    serviceId: 'scratch-removal',
    name: 'Scratch Removal',
    icon: 'Shield',
    price: 'From $150',
    duration: '2 hours',
    image: '',
    description: 'Expert paint correction and polishing',
    features: ['Multi-stage Compound', 'Paint Thickness Check', 'High Gloss Finish'],
    popular: false,
    category: 'additional',
    sortOrder: 7,
    isActive: true,
    createdAt: new Date().toISOString()
  }
];

const testimonials = [
  {
    name: 'Michael Rodriguez',
    location: 'Beverly Hills, CA',
    rating: 5,
    service: 'Ceramic Coating',
    image: 'https://images.pexels.com/photos/1222271/pexels-photo-1222271.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&fit=crop&crop=face',
    text: 'Absolutely incredible work! My Tesla Model S looks better than the day I bought it. The ceramic coating from Sundar Service Station has been holding up perfectly for over a year now.',
    date: '2 weeks ago',
    source: 'manual',
    isApproved: true,
    createdAt: new Date().toISOString()
  },
  {
    name: 'Sarah Johnson',
    location: 'Manhattan, NY',
    rating: 5,
    service: 'Paint Protection Film',
    image: 'https://images.pexels.com/photos/1130626/pexels-photo-1130626.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&fit=crop&crop=face',
    text: "I was skeptical about PPF, but after seeing the results on my Porsche 911, I'm a believer. The installation was flawless and you can't even tell it's there.",
    date: '1 month ago',
    source: 'manual',
    isApproved: true,
    createdAt: new Date().toISOString()
  },
  {
    name: 'David Chen',
    location: 'San Francisco, CA',
    rating: 5,
    service: 'Complete Detail Package',
    image: 'https://images.pexels.com/photos/1484794/pexels-photo-1484794.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&fit=crop&crop=face',
    text: 'Sundar Service Station transformed my 10-year-old BMW. The interior looks and smells brand new, and the paint correction removed years of swirl marks.',
    date: '3 weeks ago',
    source: 'manual',
    isApproved: true,
    createdAt: new Date().toISOString()
  }
];

const blogPosts = [
  {
    title: 'The Complete Guide to Ceramic Coating: Everything You Need to Know',
    slug: 'complete-guide-to-ceramic-coating',
    excerpt: "Discover the benefits of ceramic coating, how it works, and why it's the ultimate protection for your vehicle's paint.",
    content: '<p>Ceramic coating provides durable protection for your vehicle surface...</p>',
    image: 'https://images.pexels.com/photos/3354648/pexels-photo-3354648.jpeg?auto=compress&cs=tinysrgb&w=600&h=400&fit=crop',
    author: 'Mike Johnson',
    date: 'March 15, 2024',
    readTime: '5 min read',
    category: 'Paint Protection',
    isFeatured: true,
    isPublished: true,
    createdAt: new Date().toISOString()
  },
  {
    title: 'Paint Protection Film vs. Ceramic Coating: Which Is Right for You?',
    slug: 'ppf-vs-ceramic-coating',
    excerpt: "Compare the pros and cons of PPF and ceramic coating to make the best choice for your vehicle's protection needs.",
    content: '<p>Choosing between PPF and Ceramic Coating depends on your driving conditions...</p>',
    image: 'https://images.pexels.com/photos/3311574/pexels-photo-3311574.jpeg?auto=compress&cs=tinysrgb&w=600&h=400&fit=crop',
    author: 'Sarah Davis',
    date: 'March 10, 2024',
    readTime: '7 min read',
    category: 'Comparison',
    isFeatured: false,
    isPublished: true,
    createdAt: new Date().toISOString()
  }
];

const stats = [
  { key: 'happy_customers', value: '5000+', label: 'Happy Customers', sortOrder: 1 },
  { key: 'rating', value: '4.9', label: 'Average Rating', sortOrder: 2 },
  { key: 'satisfaction', value: '98%', label: 'Satisfaction Rate', sortOrder: 3 },
  { key: 'experience', value: '15+', label: 'Years Experience', sortOrder: 4 }
];

const siteConfig = [
  {
    section: 'hero',
    data: {
      title: 'SUNDAR SERVICE',
      titleAccent: 'STATION',
      subtitle: 'Experience premium car detailing with our professional ceramic coating, paint protection film, and luxury interior cleaning services. Your vehicle deserves the Sundar treatment.',
      backgroundImage: 'https://images.pexels.com/photos/3354648/pexels-photo-3354648.jpeg?auto=compress&cs=tinysrgb&w=1920&h=1080&fit=crop',
      features: ['Lifetime Warranty', 'Same Day Service', '5-Star Rated']
    }
  },
  {
    section: 'header',
    data: {
      brandName: 'SUNDAR SERVICE STATION',
      tagline: 'Premium Car Wash & Detailing',
      phone: '(555) 123-4567',
      location: 'Downtown LA'
    }
  },
  {
    section: 'footer',
    data: {
      companyDescription: "Los Angeles' premier car detailing service station specializing in ceramic coating, paint protection film, and luxury vehicle care.",
      address: '123 Premium Auto Plaza, Los Angeles, CA 90210',
      phone: '(555) 123-4567',
      email: 'info@sundarservicestation.com'
    }
  },
  {
    section: 'contact_info',
    data: {
      address: ['123 Premium Auto Plaza', 'Downtown District', 'Los Angeles, CA 90210'],
      phone: '(555) 123-4567',
      email: 'info@sundarservicestation.com',
      emergencyPhone: '(555) 123-RUSH',
      hours: [
        { days: 'Monday - Friday', time: '8:00 AM - 6:00 PM' },
        { days: 'Saturday', time: '8:00 AM - 5:00 PM' },
        { days: 'Sunday', time: '10:00 AM - 4:00 PM' }
      ],
      timeSlots: [
        '9:00 AM', '10:00 AM', '11:00 AM', '12:00 PM',
        '1:00 PM', '2:00 PM', '3:00 PM', '4:00 PM', '5:00 PM'
      ]
    }
  }
];

async function seed() {
  console.log('⚡ Connecting to MongoDB Atlas...');
  const client = new MongoClient(MONGODB_URI!);

  try {
    await client.connect();
    const db = client.db(DB_NAME);
    console.log(`✅ Connected to database: ${DB_NAME}`);

    // Seed Services
    await db.collection('services').deleteMany({});
    await db.collection('services').insertMany(services);
    console.log('✅ Services seeded');

    // Seed Testimonials
    await db.collection('testimonials').deleteMany({});
    await db.collection('testimonials').insertMany(testimonials);
    console.log('✅ Testimonials seeded');

    // Seed Blog Posts
    await db.collection('blog_posts').deleteMany({});
    await db.collection('blog_posts').insertMany(blogPosts);
    console.log('✅ Blog posts seeded');

    // Seed Stats
    await db.collection('stats').deleteMany({});
    await db.collection('stats').insertMany(stats);
    console.log('✅ Stats seeded');

    // Seed Site Config
    await db.collection('site_config').deleteMany({});
    await db.collection('site_config').insertMany(siteConfig);
    console.log('✅ Site configuration seeded');

    // Create Admin User
    const defaultPassword = process.env.ADMIN_DEFAULT_PASSWORD || 'admin123';
    const passwordHash = await bcrypt.hash(defaultPassword, 10);
    await db.collection('admin_users').deleteMany({});
    await db.collection('admin_users').insertOne({
      username: 'admin',
      passwordHash,
      createdAt: new Date().toISOString()
    });
    console.log(`✅ Admin user created (Username: admin, Password: ${defaultPassword})`);

    console.log('\n🎉 MongoDB database initial seed completed successfully!');
  } catch (error) {
    console.error('❌ Error seeding database:', error);
  } finally {
    await client.close();
  }
}

seed();
