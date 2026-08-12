import React, { useState } from 'react';
import { useApiData } from '../../hooks/useApiData';
import { adminApi } from '../../services/api';
import { Testimonial, Feedback } from '../../types';
import ImageUploader from '../components/ImageUploader';
import { Plus, Star, Check, Trash2, X, ArrowUpRight } from 'lucide-react';

const TestimonialsPage: React.FC = () => {
  const { data, refetch } = useApiData<{ testimonials: Testimonial[]; feedback: Feedback[] }>(
    () => adminApi.getTestimonials(),
    []
  );

  const [activeTab, setActiveTab] = useState<'testimonials' | 'feedback'>('testimonials');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingTestimonial, setEditingTestimonial] = useState<Partial<Testimonial> | null>(null);

  const testimonials = data?.testimonials || [];
  const feedbackList = data?.feedback || [];

  const handlePromoteFeedback = async (id: string) => {
    try {
      await adminApi.promoteFeedback(id);
      refetch();
    } catch (err) {
      alert(err instanceof Error ? err.message : 'Promotion failed');
    }
  };

  const handleDeleteTestimonial = async (id: string) => {
    if (confirm('Delete this testimonial?')) {
      await adminApi.deleteTestimonial(id);
      refetch();
    }
  };

  const handleCreateTestimonial = () => {
    setEditingTestimonial({
      name: '',
      location: '',
      rating: 5,
      service: 'Ceramic Coating',
      image: '',
      text: '',
      date: new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' }),
      source: 'manual',
      isApproved: true,
    });
    setIsModalOpen(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingTestimonial?.name || !editingTestimonial?.text) return;

    try {
      if (editingTestimonial._id) {
        await adminApi.updateTestimonial(editingTestimonial);
      } else {
        await adminApi.createTestimonial(editingTestimonial);
      }
      setIsModalOpen(false);
      setEditingTestimonial(null);
      refetch();
    } catch (err) {
      alert(err instanceof Error ? err.message : 'Save failed');
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">Testimonials & Feedback</h1>
          <p className="text-gray-400">Review user feedback and manage public testimonials</p>
        </div>

        <button
          onClick={handleCreateTestimonial}
          className="bg-red-600 hover:bg-red-700 text-white font-semibold px-5 py-2.5 rounded-xl transition-colors flex items-center gap-2"
        >
          <Plus className="h-5 w-5" />
          Add Testimonial
        </button>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-gray-800 gap-4">
        <button
          onClick={() => setActiveTab('testimonials')}
          className={`pb-3 text-sm font-semibold border-b-2 transition-colors ${
            activeTab === 'testimonials'
              ? 'border-red-600 text-red-500'
              : 'border-transparent text-gray-400 hover:text-white'
          }`}
        >
          Public Testimonials ({testimonials.length})
        </button>
        <button
          onClick={() => setActiveTab('feedback')}
          className={`pb-3 text-sm font-semibold border-b-2 transition-colors flex items-center gap-2 ${
            activeTab === 'feedback'
              ? 'border-red-600 text-red-500'
              : 'border-transparent text-gray-400 hover:text-white'
          }`}
        >
          User Feedback Submissions
          {feedbackList.length > 0 && (
            <span className="bg-red-600/30 text-red-400 px-2 py-0.5 rounded-full text-xs">
              {feedbackList.length}
            </span>
          )}
        </button>
      </div>

      {/* Tab: Testimonials */}
      {activeTab === 'testimonials' && (
        <div className="grid md:grid-cols-2 gap-6">
          {testimonials.map((t) => (
            <div key={t._id} className="bg-gray-900 border border-gray-800 rounded-2xl p-6 relative">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center space-x-3">
                  {t.image ? (
                    <img src={t.image} alt={t.name} className="w-12 h-12 rounded-full object-cover border-2 border-red-600" />
                  ) : (
                    <div className="w-12 h-12 rounded-full bg-red-600/20 border-2 border-red-600 flex items-center justify-center font-bold text-white">
                      {t.name.charAt(0)}
                    </div>
                  )}
                  <div>
                    <h3 className="font-bold text-white">{t.name}</h3>
                    <p className="text-xs text-gray-400">{t.location || 'Client'} • <span className="text-red-400">{t.service}</span></p>
                  </div>
                </div>

                <div className="flex items-center gap-1">
                  {[...Array(t.rating)].map((_, i) => (
                    <Star key={i} className="h-4 w-4 text-yellow-400 fill-yellow-400" />
                  ))}
                </div>
              </div>

              <p className="text-gray-300 text-sm mb-4 leading-relaxed">"{t.text}"</p>

              <div className="flex items-center justify-between pt-4 border-t border-gray-800 text-xs text-gray-500">
                <span>Added: {t.date}</span>
                {t._id && (
                  <button
                    onClick={() => handleDeleteTestimonial(t._id!)}
                    className="text-red-400 hover:text-red-300 flex items-center gap-1"
                  >
                    <Trash2 className="h-3.5 w-3.5" /> Remove
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Tab: Feedback */}
      {activeTab === 'feedback' && (
        <div className="space-y-4">
          {feedbackList.length === 0 ? (
            <p className="text-gray-500">No new user feedback submitted yet.</p>
          ) : (
            feedbackList.map((fb) => (
              <div key={fb._id} className="bg-gray-900 border border-gray-800 rounded-xl p-5 flex items-center justify-between">
                <div className="space-y-1">
                  <div className="flex items-center gap-3">
                    <h3 className="font-bold text-white">{fb.name}</h3>
                    <span className="text-xs text-gray-400">({fb.email})</span>
                    <div className="flex items-center gap-0.5">
                      {[...Array(fb.rating)].map((_, i) => (
                        <Star key={i} className="h-3.5 w-3.5 text-yellow-400 fill-yellow-400" />
                      ))}
                    </div>
                  </div>
                  <p className="text-sm text-gray-300">"{fb.feedback}"</p>
                  <p className="text-xs text-red-400 font-medium">{fb.service}</p>
                </div>

                <div className="flex items-center gap-3">
                  {fb.promotedToTestimonial ? (
                    <span className="text-xs bg-green-600/20 text-green-400 px-3 py-1.5 rounded-full">
                      Promoted to Public Testimonial
                    </span>
                  ) : (
                    <button
                      onClick={() => handlePromoteFeedback(fb._id!)}
                      className="bg-red-600 hover:bg-red-700 text-white text-xs font-semibold px-4 py-2 rounded-lg transition-colors flex items-center gap-1.5"
                    >
                      <ArrowUpRight className="h-4 w-4" />
                      Promote to Testimonial
                    </button>
                  )}
                </div>
              </div>
            ))
          )}
        </div>
      )}

      {/* Modal */}
      {isModalOpen && editingTestimonial && (
        <div className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-gray-900 border border-gray-800 rounded-2xl max-w-md w-full p-6 space-y-4">
            <div className="flex items-center justify-between border-b border-gray-800 pb-3">
              <h2 className="text-xl font-bold text-white">Add Testimonial</h2>
              <button onClick={() => setIsModalOpen(false)} className="text-gray-400 hover:text-white">
                <X className="h-6 w-6" />
              </button>
            </div>

            <form onSubmit={handleSave} className="space-y-4">
              <div>
                <label className="block text-sm text-gray-300 mb-1">Client Name *</label>
                <input
                  type="text"
                  required
                  value={editingTestimonial.name || ''}
                  onChange={(e) => setEditingTestimonial({ ...editingTestimonial, name: e.target.value })}
                  className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white"
                />
              </div>

              <div>
                <label className="block text-sm text-gray-300 mb-1">Client Avatar (Cloudinary)</label>
                <ImageUploader
                  value={editingTestimonial.image || ''}
                  onChange={(url) => setEditingTestimonial({ ...editingTestimonial, image: url })}
                  folder="sundar_avatars"
                />
              </div>

              <div>
                <label className="block text-sm text-gray-300 mb-1">Testimonial Text *</label>
                <textarea
                  rows={3}
                  required
                  value={editingTestimonial.text || ''}
                  onChange={(e) => setEditingTestimonial({ ...editingTestimonial, text: e.target.value })}
                  className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white"
                />
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t border-gray-800">
                <button type="button" onClick={() => setIsModalOpen(false)} className="px-4 py-2 bg-gray-800 text-gray-300 rounded-lg">Cancel</button>
                <button type="submit" className="px-4 py-2 bg-red-600 text-white rounded-lg font-semibold">Save</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default TestimonialsPage;
