import React, { useState } from 'react';
import { useApiData } from '../../hooks/useApiData';
import { adminApi } from '../../services/api';
import { Service } from '../../types';
import ImageUploader from '../components/ImageUploader';
import { Plus, Edit2, Trash2, Check, X, Shield, Sparkles, Car, Droplets } from 'lucide-react';

const iconOptions = ['Shield', 'Sparkles', 'Car', 'Droplets'];

const ServicesPage: React.FC = () => {
  const { data: services, refetch } = useApiData<Service[]>(() => adminApi.getServices(), []);
  
  const [editingService, setEditingService] = useState<Partial<Service> | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [saving, setSaving] = useState(false);

  const handleOpenCreate = () => {
    setEditingService({
      serviceId: `service-${Date.now()}`,
      name: '',
      icon: 'Shield',
      price: 'From $100',
      duration: '1-2 hours',
      image: '',
      description: '',
      features: ['Feature 1', 'Feature 2'],
      popular: false,
      category: 'main',
      sortOrder: (services?.length || 0) + 1,
      isActive: true,
    });
    setIsModalOpen(true);
  };

  const handleOpenEdit = (service: Service) => {
    setEditingService({ ...service });
    setIsModalOpen(true);
  };

  const handleDelete = async (_id: string) => {
    if (confirm('Are you sure you want to deactivate this service?')) {
      await adminApi.deleteService(_id);
      refetch();
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingService?.name) return;

    setSaving(true);
    try {
      if (editingService._id) {
        await adminApi.updateService(editingService);
      } else {
        await adminApi.createService(editingService);
      }
      setIsModalOpen(false);
      setEditingService(null);
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
          <h1 className="text-3xl font-bold text-white mb-2">Services Management</h1>
          <p className="text-gray-400">Add, edit, upload images, or reorder services displayed on the frontend</p>
        </div>

        <button
          onClick={handleOpenCreate}
          className="bg-red-600 hover:bg-red-700 text-white font-semibold px-5 py-2.5 rounded-xl transition-colors flex items-center gap-2"
        >
          <Plus className="h-5 w-5" />
          Add New Service
        </button>
      </div>

      {/* Services Grid */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {(services || []).map((service) => (
          <div key={service._id || service.serviceId} className="bg-gray-900 border border-gray-800 rounded-2xl overflow-hidden shadow-lg flex flex-col justify-between">
            <div>
              {service.image ? (
                <div className="h-44 overflow-hidden relative">
                  <img src={service.image} alt={service.name} className="w-full h-full object-cover" />
                  {service.popular && (
                    <span className="absolute top-3 right-3 bg-red-600 text-white text-xs font-bold px-2.5 py-1 rounded-full">
                      Popular
                    </span>
                  )}
                </div>
              ) : (
                <div className="h-44 bg-gray-800 flex items-center justify-center text-gray-500 text-sm">
                  No Image Uploaded
                </div>
              )}

              <div className="p-5">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="text-xl font-bold text-white">{service.name}</h3>
                  <span className="text-red-400 font-semibold text-sm">{service.price}</span>
                </div>
                <p className="text-gray-400 text-sm mb-4 line-clamp-2">{service.description}</p>
                <div className="flex items-center justify-between text-xs text-gray-500 border-t border-gray-800 pt-3">
                  <span>Category: <strong className="text-gray-300 capitalize">{service.category}</strong></span>
                  <span>Status: <strong className={service.isActive ? 'text-green-400' : 'text-red-400'}>{service.isActive ? 'Active' : 'Inactive'}</strong></span>
                </div>
              </div>
            </div>

            <div className="p-4 bg-gray-900/50 border-t border-gray-800 flex items-center justify-end gap-2">
              <button
                onClick={() => handleOpenEdit(service)}
                className="p-2 bg-gray-800 hover:bg-gray-700 text-gray-200 rounded-lg transition-colors flex items-center gap-1 text-xs"
              >
                <Edit2 className="h-4 w-4" />
                Edit
              </button>
              {service._id && (
                <button
                  onClick={() => handleDelete(service._id!)}
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

      {/* Modal Form */}
      {isModalOpen && editingService && (
        <div className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-gray-900 border border-gray-800 rounded-2xl max-w-xl w-full p-6 space-y-6 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-gray-800 pb-4">
              <h2 className="text-xl font-bold text-white">
                {editingService._id ? 'Edit Service' : 'Add New Service'}
              </h2>
              <button
                onClick={() => setIsModalOpen(false)}
                className="text-gray-400 hover:text-white"
              >
                <X className="h-6 w-6" />
              </button>
            </div>

            <form onSubmit={handleSave} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">Service Name *</label>
                <input
                  type="text"
                  required
                  value={editingService.name || ''}
                  onChange={(e) => setEditingService({ ...editingService, name: e.target.value })}
                  className="w-full px-4 py-2.5 bg-gray-800 border border-gray-700 rounded-lg text-white outline-none focus:border-red-500"
                />
              </div>

              {/* Cloudinary Image Uploader */}
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">Service Image (Cloudinary)</label>
                <ImageUploader
                  value={editingService.image || ''}
                  onChange={(url) => setEditingService({ ...editingService, image: url })}
                  folder="sundar_services"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1">Price</label>
                  <input
                    type="text"
                    value={editingService.price || ''}
                    onChange={(e) => setEditingService({ ...editingService, price: e.target.value })}
                    className="w-full px-4 py-2.5 bg-gray-800 border border-gray-700 rounded-lg text-white outline-none focus:border-red-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1">Duration</label>
                  <input
                    type="text"
                    value={editingService.duration || ''}
                    onChange={(e) => setEditingService({ ...editingService, duration: e.target.value })}
                    className="w-full px-4 py-2.5 bg-gray-800 border border-gray-700 rounded-lg text-white outline-none focus:border-red-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">Description</label>
                <textarea
                  rows={3}
                  value={editingService.description || ''}
                  onChange={(e) => setEditingService({ ...editingService, description: e.target.value })}
                  className="w-full px-4 py-2.5 bg-gray-800 border border-gray-700 rounded-lg text-white outline-none focus:border-red-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1">Category</label>
                  <select
                    value={editingService.category || 'main'}
                    onChange={(e) => setEditingService({ ...editingService, category: e.target.value as any })}
                    className="w-full px-4 py-2.5 bg-gray-800 border border-gray-700 rounded-lg text-white outline-none focus:border-red-500"
                  >
                    <option value="main">Main Service</option>
                    <option value="additional">Additional Service</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1">Icon</label>
                  <select
                    value={editingService.icon || 'Shield'}
                    onChange={(e) => setEditingService({ ...editingService, icon: e.target.value })}
                    className="w-full px-4 py-2.5 bg-gray-800 border border-gray-700 rounded-lg text-white outline-none focus:border-red-500"
                  >
                    {iconOptions.map((opt) => (
                      <option key={opt} value={opt}>{opt}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">Features (comma separated)</label>
                <input
                  type="text"
                  value={(editingService.features || []).join(', ')}
                  onChange={(e) => setEditingService({
                    ...editingService,
                    features: e.target.value.split(',').map((f) => f.trim())
                  })}
                  className="w-full px-4 py-2.5 bg-gray-800 border border-gray-700 rounded-lg text-white outline-none focus:border-red-500"
                  placeholder="Feature 1, Feature 2, Feature 3"
                />
              </div>

              <div className="flex items-center gap-6 pt-2">
                <label className="flex items-center gap-2 text-sm text-gray-300 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={editingService.popular || false}
                    onChange={(e) => setEditingService({ ...editingService, popular: e.target.checked })}
                    className="rounded border-gray-700 text-red-600 focus:ring-red-500 bg-gray-800"
                  />
                  Mark as Most Popular
                </label>

                <label className="flex items-center gap-2 text-sm text-gray-300 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={editingService.isActive !== false}
                    onChange={(e) => setEditingService({ ...editingService, isActive: e.target.checked })}
                    className="rounded border-gray-700 text-red-600 focus:ring-red-500 bg-gray-800"
                  />
                  Is Active
                </label>
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t border-gray-800">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-5 py-2.5 bg-gray-800 hover:bg-gray-700 text-gray-300 rounded-xl transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="px-5 py-2.5 bg-red-600 hover:bg-red-700 text-white font-semibold rounded-xl transition-colors"
                >
                  {saving ? 'Saving...' : 'Save Service'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default ServicesPage;
