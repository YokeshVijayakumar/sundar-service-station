import React from 'react';
import { useApiData } from '../../hooks/useApiData';
import { adminApi } from '../../services/api';
import { Wrench, Calendar, FileText, Mail, MessageSquare, ArrowUpRight } from 'lucide-react';
import { Link } from 'react-router-dom';

const DashboardPage: React.FC = () => {
  const { data: bookings } = useApiData<any[]>(() => adminApi.getBookings(), []);
  const { data: services } = useApiData<any[]>(() => adminApi.getServices(), []);
  const { data: posts } = useApiData<any[]>(() => adminApi.getBlogPosts(), []);
  const { data: subscribers } = useApiData<any[]>(() => adminApi.getSubscribers(), []);

  const totalBookings = bookings?.length || 0;
  const pendingBookings = bookings?.filter((b) => b.status === 'pending')?.length || 0;
  const totalServices = services?.length || 0;
  const totalPosts = posts?.length || 0;
  const totalSubscribers = subscribers?.length || 0;

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-white mb-2">Dashboard Overview</h1>
        <p className="text-gray-400">Welcome to Sundar Service Station management dashboard</p>
      </div>

      {/* Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-gray-900 border border-gray-800 p-6 rounded-2xl">
          <div className="flex items-center justify-between mb-4">
            <span className="text-gray-400 text-sm font-medium">Pending Bookings</span>
            <div className="p-3 bg-red-600/20 text-red-500 rounded-xl">
              <Calendar className="h-6 w-6" />
            </div>
          </div>
          <div className="text-3xl font-bold text-white mb-1">{pendingBookings}</div>
          <p className="text-xs text-gray-500">{totalBookings} total bookings</p>
        </div>

        <div className="bg-gray-900 border border-gray-800 p-6 rounded-2xl">
          <div className="flex items-center justify-between mb-4">
            <span className="text-gray-400 text-sm font-medium">Total Services</span>
            <div className="p-3 bg-red-600/20 text-red-500 rounded-xl">
              <Wrench className="h-6 w-6" />
            </div>
          </div>
          <div className="text-3xl font-bold text-white mb-1">{totalServices}</div>
          <p className="text-xs text-gray-500">Active features on site</p>
        </div>

        <div className="bg-gray-900 border border-gray-800 p-6 rounded-2xl">
          <div className="flex items-center justify-between mb-4">
            <span className="text-gray-400 text-sm font-medium">Blog Articles</span>
            <div className="p-3 bg-red-600/20 text-red-500 rounded-xl">
              <FileText className="h-6 w-6" />
            </div>
          </div>
          <div className="text-3xl font-bold text-white mb-1">{totalPosts}</div>
          <p className="text-xs text-gray-500">Published posts</p>
        </div>

        <div className="bg-gray-900 border border-gray-800 p-6 rounded-2xl">
          <div className="flex items-center justify-between mb-4">
            <span className="text-gray-400 text-sm font-medium">Subscribers</span>
            <div className="p-3 bg-red-600/20 text-red-500 rounded-xl">
              <Mail className="h-6 w-6" />
            </div>
          </div>
          <div className="text-3xl font-bold text-white mb-1">{totalSubscribers}</div>
          <p className="text-xs text-gray-500">Newsletter audience</p>
        </div>
      </div>

      {/* Quick Action links */}
      <div className="grid md:grid-cols-2 gap-6">
        <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6">
          <h2 className="text-xl font-bold text-white mb-4">Quick Management</h2>
          <div className="space-y-3">
            <Link
              to="/admin/services"
              className="flex items-center justify-between p-4 bg-gray-800/50 hover:bg-gray-800 rounded-xl text-gray-300 hover:text-white transition-colors"
            >
              <div className="flex items-center gap-3">
                <Wrench className="h-5 w-5 text-red-500" />
                <span>Add or Edit Services & Images</span>
              </div>
              <ArrowUpRight className="h-5 w-5" />
            </Link>

            <Link
              to="/admin/bookings"
              className="flex items-center justify-between p-4 bg-gray-800/50 hover:bg-gray-800 rounded-xl text-gray-300 hover:text-white transition-colors"
            >
              <div className="flex items-center gap-3">
                <Calendar className="h-5 w-5 text-red-500" />
                <span>Manage Customer Bookings</span>
              </div>
              <ArrowUpRight className="h-5 w-5" />
            </Link>

            <Link
              to="/admin/testimonials"
              className="flex items-center justify-between p-4 bg-gray-800/50 hover:bg-gray-800 rounded-xl text-gray-300 hover:text-white transition-colors"
            >
              <div className="flex items-center gap-3">
                <MessageSquare className="h-5 w-5 text-red-500" />
                <span>Review Customer Feedback</span>
              </div>
              <ArrowUpRight className="h-5 w-5" />
            </Link>
          </div>
        </div>

        {/* Recent Bookings List */}
        <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold text-white">Recent Booking Requests</h2>
            <Link to="/admin/bookings" className="text-sm text-red-500 hover:underline">View all</Link>
          </div>
          
          {bookings && bookings.length > 0 ? (
            <div className="space-y-3">
              {bookings.slice(0, 4).map((b) => (
                <div key={b._id} className="p-3 bg-gray-800/40 rounded-xl flex items-center justify-between">
                  <div>
                    <h4 className="font-semibold text-white text-sm">{b.name}</h4>
                    <p className="text-xs text-gray-400">{b.service} • {b.vehicle}</p>
                  </div>
                  <span className={`text-xs px-2.5 py-1 rounded-full font-medium ${
                    b.status === 'confirmed' ? 'bg-green-600/20 text-green-400' :
                    b.status === 'completed' ? 'bg-blue-600/20 text-blue-400' :
                    'bg-yellow-600/20 text-yellow-400'
                  }`}>
                    {b.status}
                  </span>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-500 text-sm">No recent bookings submitted yet.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;
