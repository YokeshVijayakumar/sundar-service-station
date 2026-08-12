import React from 'react';
import { Link, Outlet, useLocation, useNavigate } from 'react-router-dom';
import {
  LayoutDashboard,
  Wrench,
  FileText,
  MessageSquare,
  Settings,
  Calendar,
  Mail,
  LogOut,
  Car,
  ChevronRight,
} from 'lucide-react';
import { useAuthContext } from '../context/AuthContext';

const AdminLayout: React.FC = () => {
  const { username, logout } = useAuthContext();
  const location = useLocation();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/admin/login');
  };

  const navItems = [
    { label: 'Dashboard', path: '/admin', icon: LayoutDashboard },
    { label: 'Services', path: '/admin/services', icon: Wrench },
    { label: 'Blog Posts', path: '/admin/blog-posts', icon: FileText },
    { label: 'Testimonials & Reviews', path: '/admin/testimonials', icon: MessageSquare },
    { label: 'Bookings', path: '/admin/bookings', icon: Calendar },
    { label: 'Newsletter', path: '/admin/newsletter', icon: Mail },
    { label: 'Site Config', path: '/admin/site-config', icon: Settings },
  ];

  return (
    <div className="min-h-screen bg-gray-950 text-gray-100 flex">
      {/* Sidebar */}
      <aside className="w-64 bg-gray-900 border-r border-gray-800 flex flex-col justify-between">
        <div>
          {/* Header */}
          <div className="p-6 border-b border-gray-800 flex items-center space-x-3">
            <div className="bg-red-600 p-2 rounded-lg">
              <Car className="h-6 w-6 text-white" />
            </div>
            <div>
              <h2 className="font-bold text-white text-sm">SUNDAR ADMIN</h2>
              <p className="text-xs text-red-400">Control Panel</p>
            </div>
          </div>

          {/* Nav list */}
          <nav className="p-4 space-y-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = location.pathname === item.path;
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`flex items-center justify-between px-4 py-3 rounded-lg text-sm font-medium transition-colors duration-150 ${
                    isActive
                      ? 'bg-red-600 text-white font-semibold'
                      : 'text-gray-400 hover:text-white hover:bg-gray-800'
                  }`}
                >
                  <div className="flex items-center space-x-3">
                    <Icon className="h-5 w-5" />
                    <span>{item.label}</span>
                  </div>
                  {isActive && <ChevronRight className="h-4 w-4" />}
                </Link>
              );
            })}
          </nav>
        </div>

        {/* Footer info & Logout */}
        <div className="p-4 border-t border-gray-800">
          <div className="flex items-center justify-between px-2 mb-3">
            <span className="text-xs text-gray-400">Logged in as:</span>
            <span className="text-xs font-semibold text-white">{username || 'admin'}</span>
          </div>
          <button
            onClick={handleLogout}
            className="w-full flex items-center justify-center space-x-2 bg-gray-800 hover:bg-red-600/20 hover:text-red-400 text-gray-300 py-2.5 rounded-lg text-sm font-medium transition-colors duration-200"
          >
            <LogOut className="h-4 w-4" />
            <span>Sign Out</span>
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 overflow-y-auto p-8">
        <Outlet />
      </main>
    </div>
  );
};

export default AdminLayout;
