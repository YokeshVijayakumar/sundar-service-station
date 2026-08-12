import React, { useState } from 'react';
import { Calendar, User, ArrowRight, Clock } from 'lucide-react';
import { useApiData } from '../hooks/useApiData';
import { publicApi } from '../services/api';
import { BlogPost } from '../types';
import LoadingSkeleton from './LoadingSkeleton';

const Blog: React.FC = () => {
  const [newsletterEmail, setNewsletterEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);
  const [subscribing, setSubscribing] = useState(false);
  const [newsletterMsg, setNewsletterMsg] = useState('');

  const { data: posts, loading, error } = useApiData<BlogPost[]>(
    () => publicApi.getBlogPosts(),
    []
  );

  const handleSubscribe = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newsletterEmail) return;

    setSubscribing(true);
    try {
      const res = await publicApi.subscribeNewsletter(newsletterEmail);
      setSubscribed(true);
      setNewsletterMsg(res.message || 'Successfully subscribed!');
      setNewsletterEmail('');
    } catch (err) {
      setNewsletterMsg(err instanceof Error ? err.message : 'Subscription failed');
    } finally {
      setSubscribing(false);
    }
  };

  if (loading) {
    return (
      <section id="blog" className="py-20 bg-black">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
              Detailing Tips & Insights
            </h2>
          </div>
          <LoadingSkeleton variant="card" count={3} />
        </div>
      </section>
    );
  }

  const blogPosts = posts || [];
  const featuredPost = blogPosts.find((p) => p.isFeatured) || blogPosts[0];
  const regularPosts = blogPosts.filter((p) => p !== featuredPost);

  return (
    <section id="blog" className="py-20 bg-black">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
            Detailing Tips & Insights
          </h2>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto">
            Stay informed with expert advice, industry insights, and professional tips 
            to keep your vehicle looking its absolute best.
          </p>
        </div>

        {error && (
          <div className="text-center text-red-400 mb-8 bg-red-600/10 border border-red-600/30 p-4 rounded-xl">
            Failed to load blog posts.
          </div>
        )}

        {/* Featured Post */}
        {featuredPost && (
          <div className="mb-16">
            <div className="bg-gray-900 border border-gray-800 rounded-2xl shadow-lg overflow-hidden hover:shadow-xl hover:border-red-600/50 transition-all duration-300">
              <div className="md:flex">
                {featuredPost.image && (
                  <div className="md:w-1/2">
                    <img
                      src={featuredPost.image}
                      alt={featuredPost.title}
                      className="w-full h-64 md:h-full object-cover"
                    />
                  </div>
                )}
                <div className={`${featuredPost.image ? 'md:w-1/2' : 'w-full'} p-8 md:p-12`}>
                  <div className="flex items-center space-x-4 mb-4">
                    <span className="bg-red-600 text-white px-3 py-1 rounded-full text-sm font-medium">
                      Featured
                    </span>
                    <span className="bg-gray-800 text-gray-300 px-3 py-1 rounded-full text-sm">
                      {featuredPost.category}
                    </span>
                  </div>
                  <h3 className="text-2xl md:text-3xl font-bold text-white mb-4 leading-tight">
                    {featuredPost.title}
                  </h3>
                  <p className="text-gray-300 mb-6 text-lg leading-relaxed">
                    {featuredPost.excerpt}
                  </p>
                  <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center space-x-4 text-sm text-gray-400">
                      <div className="flex items-center space-x-1">
                        <User className="h-4 w-4" />
                        <span>{featuredPost.author}</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <Calendar className="h-4 w-4" />
                        <span>{featuredPost.date}</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <Clock className="h-4 w-4" />
                        <span>{featuredPost.readTime}</span>
                      </div>
                    </div>
                  </div>
                  <button className="group bg-red-600 hover:bg-red-700 text-white px-6 py-3 rounded-lg font-semibold transition-colors duration-200 flex items-center space-x-2">
                    <span>Read Full Article</span>
                    <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform duration-200" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Regular Posts Grid */}
        {regularPosts.length > 0 && (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {regularPosts.map((post) => (
              <article key={post._id || post.slug} className="bg-gray-900 border border-gray-800 rounded-xl shadow-lg overflow-hidden hover:shadow-xl hover:border-red-600/50 transition-all duration-300 group">
                {post.image && (
                  <div className="relative overflow-hidden">
                    <img
                      src={post.image}
                      alt={post.title}
                      className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute top-4 left-4">
                      <span className="bg-black/80 backdrop-blur-sm text-white px-3 py-1 rounded-full text-sm font-medium">
                        {post.category}
                      </span>
                    </div>
                  </div>
                )}
                
                <div className="p-6">
                  <h3 className="font-bold text-white mb-3 text-lg leading-tight group-hover:text-red-400 transition-colors duration-200">
                    {post.title}
                  </h3>
                  <p className="text-gray-400 mb-4 text-sm leading-relaxed">
                    {post.excerpt}
                  </p>
                  
                  <div className="flex items-center justify-between text-xs text-gray-500 mb-4">
                    <div className="flex items-center space-x-3">
                      <div className="flex items-center space-x-1">
                        <User className="h-3 w-3" />
                        <span>{post.author}</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <Calendar className="h-3 w-3" />
                        <span>{post.date}</span>
                      </div>
                    </div>
                    <div className="flex items-center space-x-1">
                      <Clock className="h-3 w-3" />
                      <span>{post.readTime}</span>
                    </div>
                  </div>
                  
                  <button className="group text-red-500 hover:text-red-400 font-semibold text-sm flex items-center space-x-1 transition-colors duration-200">
                    <span>Read More</span>
                    <ArrowRight className="h-3 w-3 group-hover:translate-x-1 transition-transform duration-200" />
                  </button>
                </div>
              </article>
            ))}
          </div>
        )}

        {/* Newsletter Signup */}
        <div className="mt-16 bg-red-600 rounded-2xl p-8 md:p-12 text-center">
          <h3 className="text-2xl md:text-3xl font-bold text-white mb-4">
            Stay Updated with Car Care Tips
          </h3>
          <p className="text-red-100 mb-8 max-w-2xl mx-auto">
            Subscribe to our newsletter and get the latest detailing tips, exclusive offers, 
            and industry insights delivered directly to your inbox.
          </p>

          {subscribed ? (
            <div className="bg-black/20 text-white p-4 rounded-lg font-semibold max-w-md mx-auto">
              {newsletterMsg}
            </div>
          ) : (
            <form onSubmit={handleSubscribe} className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
              <input
                type="email"
                required
                value={newsletterEmail}
                onChange={(e) => setNewsletterEmail(e.target.value)}
                placeholder="Enter your email address"
                className="flex-1 px-4 py-3 rounded-lg border-0 focus:ring-2 focus:ring-black outline-none"
              />
              <button
                type="submit"
                disabled={subscribing}
                className="bg-black hover:bg-gray-900 text-white px-6 py-3 rounded-lg font-semibold transition-colors duration-200 disabled:opacity-50"
              >
                {subscribing ? 'Subscribing...' : 'Subscribe'}
              </button>
            </form>
          )}
          {newsletterMsg && !subscribed && (
            <p className="text-red-200 text-sm mt-2">{newsletterMsg}</p>
          )}
        </div>
      </div>
    </section>
  );
};

export default Blog;