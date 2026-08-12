import React, { useState, useEffect } from 'react';
import { useApiData } from '../../hooks/useApiData';
import { adminApi } from '../../services/api';
import ImageUploader from '../components/ImageUploader';
import { Save, Check } from 'lucide-react';

const SiteConfigPage: React.FC = () => {
  const { data: configData, refetch } = useApiData<Record<string, any>>(
    () => adminApi.getSiteConfig(),
    []
  );

  const [heroConfig, setHeroConfig] = useState<any>({
    title: 'SUNDAR SERVICE',
    titleAccent: 'STATION',
    subtitle: '',
    backgroundImage: '',
  });

  const [headerConfig, setHeaderConfig] = useState<any>({
    brandName: 'SUNDAR SERVICE STATION',
    tagline: 'Premium Car Wash & Detailing',
    phone: '(555) 123-4567',
    location: 'Downtown LA',
  });

  const [savedSection, setSavedSection] = useState<string | null>(null);

  useEffect(() => {
    if (configData) {
      if (configData.hero) setHeroConfig(configData.hero);
      if (configData.header) setHeaderConfig(configData.header);
    }
  }, [configData]);

  const handleSaveHero = async (e: React.FormEvent) => {
    e.preventDefault();
    await adminApi.updateSiteConfig('hero', heroConfig);
    setSavedSection('hero');
    setTimeout(() => setSavedSection(null), 3000);
    refetch();
  };

  const handleSaveHeader = async (e: React.FormEvent) => {
    e.preventDefault();
    await adminApi.updateSiteConfig('header', headerConfig);
    setSavedSection('header');
    setTimeout(() => setSavedSection(null), 3000);
    refetch();
  };

  return (
    <div className="space-y-8 max-w-4xl">
      <div>
        <h1 className="text-3xl font-bold text-white mb-2">Site Configuration</h1>
        <p className="text-gray-400">Edit hero background images, title texts, brand titles, and contact header info</p>
      </div>

      {/* Hero Section Config */}
      <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6 space-y-6">
        <div className="flex items-center justify-between border-b border-gray-800 pb-4">
          <h2 className="text-xl font-bold text-white">Hero Section Configuration</h2>
          {savedSection === 'hero' && (
            <span className="text-xs bg-green-600/20 text-green-400 px-3 py-1 rounded-full flex items-center gap-1">
              <Check className="h-3.5 w-3.5" /> Saved!
            </span>
          )}
        </div>

        <form onSubmit={handleSaveHero} className="space-y-4">
          <div>
            <label className="block text-sm text-gray-300 mb-1">Hero Title Line 1</label>
            <input
              type="text"
              value={heroConfig.title || ''}
              onChange={(e) => setHeroConfig({ ...heroConfig, title: e.target.value })}
              className="w-full px-4 py-2.5 bg-gray-800 border border-gray-700 rounded-lg text-white"
            />
          </div>

          <div>
            <label className="block text-sm text-gray-300 mb-1">Hero Title Accent (Red Block)</label>
            <input
              type="text"
              value={heroConfig.titleAccent || ''}
              onChange={(e) => setHeroConfig({ ...heroConfig, titleAccent: e.target.value })}
              className="w-full px-4 py-2.5 bg-gray-800 border border-gray-700 rounded-lg text-white"
            />
          </div>

          <div>
            <label className="block text-sm text-gray-300 mb-1">Hero Subtitle</label>
            <textarea
              rows={3}
              value={heroConfig.subtitle || ''}
              onChange={(e) => setHeroConfig({ ...heroConfig, subtitle: e.target.value })}
              className="w-full px-4 py-2.5 bg-gray-800 border border-gray-700 rounded-lg text-white"
            />
          </div>

          <div>
            <label className="block text-sm text-gray-300 mb-1">Hero Background Image (Cloudinary)</label>
            <ImageUploader
              value={heroConfig.backgroundImage || ''}
              onChange={(url) => setHeroConfig({ ...heroConfig, backgroundImage: url })}
              folder="sundar_hero"
            />
          </div>

          <div className="flex justify-end pt-2">
            <button
              type="submit"
              className="bg-red-600 hover:bg-red-700 text-white font-semibold px-6 py-2.5 rounded-xl transition-colors flex items-center gap-2"
            >
              <Save className="h-4 w-4" />
              Save Hero Settings
            </button>
          </div>
        </form>
      </div>

      {/* Header Config */}
      <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6 space-y-6">
        <div className="flex items-center justify-between border-b border-gray-800 pb-4">
          <h2 className="text-xl font-bold text-white">Header & Brand Configuration</h2>
          {savedSection === 'header' && (
            <span className="text-xs bg-green-600/20 text-green-400 px-3 py-1 rounded-full flex items-center gap-1">
              <Check className="h-3.5 w-3.5" /> Saved!
            </span>
          )}
        </div>

        <form onSubmit={handleSaveHeader} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm text-gray-300 mb-1">Brand Name</label>
              <input
                type="text"
                value={headerConfig.brandName || ''}
                onChange={(e) => setHeaderConfig({ ...headerConfig, brandName: e.target.value })}
                className="w-full px-4 py-2.5 bg-gray-800 border border-gray-700 rounded-lg text-white"
              />
            </div>

            <div>
              <label className="block text-sm text-gray-300 mb-1">Tagline</label>
              <input
                type="text"
                value={headerConfig.tagline || ''}
                onChange={(e) => setHeaderConfig({ ...headerConfig, tagline: e.target.value })}
                className="w-full px-4 py-2.5 bg-gray-800 border border-gray-700 rounded-lg text-white"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm text-gray-300 mb-1">Phone Number</label>
              <input
                type="text"
                value={headerConfig.phone || ''}
                onChange={(e) => setHeaderConfig({ ...headerConfig, phone: e.target.value })}
                className="w-full px-4 py-2.5 bg-gray-800 border border-gray-700 rounded-lg text-white"
              />
            </div>

            <div>
              <label className="block text-sm text-gray-300 mb-1">Location Label</label>
              <input
                type="text"
                value={headerConfig.location || ''}
                onChange={(e) => setHeaderConfig({ ...headerConfig, location: e.target.value })}
                className="w-full px-4 py-2.5 bg-gray-800 border border-gray-700 rounded-lg text-white"
              />
            </div>
          </div>

          <div className="flex justify-end pt-2">
            <button
              type="submit"
              className="bg-red-600 hover:bg-red-700 text-white font-semibold px-6 py-2.5 rounded-xl transition-colors flex items-center gap-2"
            >
              <Save className="h-4 w-4" />
              Save Header Settings
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default SiteConfigPage;
