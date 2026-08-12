import React from 'react';
import { useApiData } from '../../hooks/useApiData';
import { adminApi } from '../../services/api';
import { NewsletterSubscriber } from '../../types';
import { Mail, Trash2 } from 'lucide-react';

const NewsletterPage: React.FC = () => {
  const { data: subscribers, refetch } = useApiData<NewsletterSubscriber[]>(
    () => adminApi.getSubscribers(),
    []
  );

  const handleDelete = async (id: string) => {
    if (confirm('Remove subscriber from newsletter?')) {
      await adminApi.deleteSubscriber(id);
      refetch();
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-white mb-2">Newsletter Subscribers</h1>
        <p className="text-gray-400">List of users who subscribed to car care tips and updates</p>
      </div>

      <div className="bg-gray-900 border border-gray-800 rounded-2xl overflow-hidden shadow-lg">
        <table className="w-full text-left text-sm text-gray-300">
          <thead className="bg-gray-800/60 text-gray-400 uppercase text-xs">
            <tr>
              <th className="px-6 py-4">Email Address</th>
              <th className="px-6 py-4">Subscribed At</th>
              <th className="px-6 py-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-800">
            {(subscribers || []).length === 0 ? (
              <tr>
                <td colSpan={3} className="px-6 py-8 text-center text-gray-500">
                  No newsletter subscribers yet.
                </td>
              </tr>
            ) : (
              (subscribers || []).map((sub) => (
                <tr key={sub._id} className="hover:bg-gray-800/40 transition-colors">
                  <td className="px-6 py-4 font-semibold text-white flex items-center gap-2">
                    <Mail className="h-4 w-4 text-red-500" />
                    {sub.email}
                  </td>
                  <td className="px-6 py-4 text-gray-400">
                    {sub.subscribedAt ? new Date(sub.subscribedAt).toLocaleDateString() : 'N/A'}
                  </td>
                  <td className="px-6 py-4 text-right">
                    {sub._id && (
                      <button
                        onClick={() => handleDelete(sub._id!)}
                        className="text-red-400 hover:text-red-300 p-2 hover:bg-red-600/10 rounded-lg transition-colors"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    )}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default NewsletterPage;
