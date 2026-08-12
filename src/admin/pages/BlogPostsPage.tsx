import React, { useState } from 'react';
import { useApiData } from '../../hooks/useApiData';
import { adminApi } from '../../services/api';
import { BlogPost } from '../../types';
import ImageUploader from '../components/ImageUploader';
import { Plus, Edit2, Trash2, X } from 'lucide-react';

const BlogPostsPage: React.FC = () => {
  const { data: posts, refetch } = useApiData<BlogPost[]>(() => adminApi.getBlogPosts(), []);
  
  const [editingPost, setEditingPost] = useState<Partial<BlogPost> | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [saving, setSaving] = useState(false);

  const handleOpenCreate = () => {
    setEditingPost({
      title: '',
      excerpt: '',
      content: '',
      image: '',
      author: 'Admin',
      date: new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' }),
      readTime: '5 min read',
      category: 'General',
      isFeatured: false,
      isPublished: true,
    });
    setIsModalOpen(true);
  };

  const handleOpenEdit = (post: BlogPost) => {
    setEditingPost({ ...post });
    setIsModalOpen(true);
  };

  const handleDelete = async (_id: string) => {
    if (confirm('Delete this blog post permanently?')) {
      await adminApi.deleteBlogPost(_id);
      refetch();
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingPost?.title) return;

    setSaving(true);
    try {
      if (editingPost._id) {
        await adminApi.updateBlogPost(editingPost);
      } else {
        await adminApi.createBlogPost(editingPost);
      }
      setIsModalOpen(false);
      setEditingPost(null);
      refetch();
    } catch (err) {
      alert(err instanceof Error ? err.message : 'Save failed');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">Blog Posts Management</h1>
          <p className="text-gray-400">Publish articles, upload feature images, and manage categories</p>
        </div>

        <button
          onClick={handleOpenCreate}
          className="bg-red-600 hover:bg-red-700 text-white font-semibold px-5 py-2.5 rounded-xl transition-colors flex items-center gap-2"
        >
          <Plus className="h-5 w-5" />
          Create Blog Post
        </button>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {(posts || []).map((post) => (
          <div key={post._id || post.slug} className="bg-gray-900 border border-gray-800 rounded-2xl overflow-hidden shadow-lg flex flex-col justify-between">
            <div>
              {post.image ? (
                <div className="h-44 overflow-hidden relative">
                  <img src={post.image} alt={post.title} className="w-full h-full object-cover" />
                  {post.isFeatured && (
                    <span className="absolute top-3 right-3 bg-red-600 text-white text-xs font-bold px-2.5 py-1 rounded-full">
                      Featured
                    </span>
                  )}
                </div>
              ) : (
                <div className="h-44 bg-gray-800 flex items-center justify-center text-gray-500 text-sm">
                  No Cover Image
                </div>
              )}

              <div className="p-5">
                <span className="text-xs font-medium bg-gray-800 text-red-400 px-2.5 py-1 rounded-full">
                  {post.category}
                </span>
                <h3 className="text-xl font-bold text-white mt-2 mb-2 line-clamp-2">{post.title}</h3>
                <p className="text-gray-400 text-sm mb-4 line-clamp-2">{post.excerpt}</p>
                <div className="flex items-center justify-between text-xs text-gray-500 border-t border-gray-800 pt-3">
                  <span>By {post.author}</span>
                  <span>{post.date}</span>
                </div>
              </div>
            </div>

            <div className="p-4 bg-gray-900/50 border-t border-gray-800 flex items-center justify-end gap-2">
              <button
                onClick={() => handleOpenEdit(post)}
                className="p-2 bg-gray-800 hover:bg-gray-700 text-gray-200 rounded-lg transition-colors flex items-center gap-1 text-xs"
              >
                <Edit2 className="h-4 w-4" />
                Edit
              </button>
              {post._id && (
                <button
                  onClick={() => handleDelete(post._id!)}
                  className="p-2 bg-red-600/20 hover:bg-red-600/40 text-red-400 rounded-lg transition-colors flex items-center gap-1 text-xs"
                >
                  <Trash2 className="h-4 w-4" />
                  Delete
                </button>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Modal */}
      {isModalOpen && editingPost && (
        <div className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-gray-900 border border-gray-800 rounded-2xl max-w-2xl w-full p-6 space-y-6 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-gray-800 pb-4">
              <h2 className="text-xl font-bold text-white">
                {editingPost._id ? 'Edit Blog Post' : 'Create New Blog Post'}
              </h2>
              <button onClick={() => setIsModalOpen(false)} className="text-gray-400 hover:text-white">
                <X className="h-6 w-6" />
              </button>
            </div>

            <form onSubmit={handleSave} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">Post Title *</label>
                <input
                  type="text"
                  required
                  value={editingPost.title || ''}
                  onChange={(e) => setEditingPost({ ...editingPost, title: e.target.value })}
                  className="w-full px-4 py-2.5 bg-gray-800 border border-gray-700 rounded-lg text-white outline-none focus:border-red-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">Feature Image (Cloudinary)</label>
                <ImageUploader
                  value={editingPost.image || ''}
                  onChange={(url) => setEditingPost({ ...editingPost, image: url })}
                  folder="sundar_blog"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">Excerpt *</label>
                <textarea
                  rows={2}
                  required
                  value={editingPost.excerpt || ''}
                  onChange={(e) => setEditingPost({ ...editingPost, excerpt: e.target.value })}
                  className="w-full px-4 py-2.5 bg-gray-800 border border-gray-700 rounded-lg text-white outline-none focus:border-red-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1">Author</label>
                  <input
                    type="text"
                    value={editingPost.author || ''}
                    onChange={(e) => setEditingPost({ ...editingPost, author: e.target.value })}
                    className="w-full px-4 py-2.5 bg-gray-800 border border-gray-700 rounded-lg text-white outline-none focus:border-red-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1">Category</label>
                  <input
                    type="text"
                    value={editingPost.category || ''}
                    onChange={(e) => setEditingPost({ ...editingPost, category: e.target.value })}
                    className="w-full px-4 py-2.5 bg-gray-800 border border-gray-700 rounded-lg text-white outline-none focus:border-red-500"
                  />
                </div>
              </div>

              <div className="flex items-center gap-6 pt-2">
                <label className="flex items-center gap-2 text-sm text-gray-300 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={editingPost.isFeatured || false}
                    onChange={(e) => setEditingPost({ ...editingPost, isFeatured: e.target.checked })}
                    className="rounded border-gray-700 text-red-600 focus:ring-red-500 bg-gray-800"
                  />
                  Mark as Featured Post
                </label>

                <label className="flex items-center gap-2 text-sm text-gray-300 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={editingPost.isPublished !== false}
                    onChange={(e) => setEditingPost({ ...editingPost, isPublished: e.target.checked })}
                    className="rounded border-gray-700 text-red-600 focus:ring-red-500 bg-gray-800"
                  />
                  Is Published
                </label>
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t border-gray-800">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-5 py-2.5 bg-gray-800 hover:bg-gray-700 text-gray-300 rounded-xl"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="px-5 py-2.5 bg-red-600 hover:bg-red-700 text-white font-semibold rounded-xl"
                >
                  {saving ? 'Saving...' : 'Save Post'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default BlogPostsPage;
