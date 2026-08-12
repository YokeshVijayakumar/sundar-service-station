import React from 'react';
import { useApiData } from '../../hooks/useApiData';
import { adminApi } from '../../services/api';
import { Booking } from '../../types';
import { Calendar, Phone, Mail, Car, Clock } from 'lucide-react';

const BookingsPage: React.FC = () => {
  const { data: bookings, refetch } = useApiData<Booking[]>(() => adminApi.getBookings(), []);

  const handleStatusChange = async (_id: string, status: string) => {
    try {
      await adminApi.updateBookingStatus(_id, status);
      refetch();
    } catch (err) {
      alert('Status update failed');
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-white mb-2">Bookings Requests</h1>
        <p className="text-gray-400">View and update status of customer detailing appointments</p>
      </div>

      <div className="space-y-4">
        {(bookings || []).length === 0 ? (
          <div className="bg-gray-900 border border-gray-800 rounded-2xl p-12 text-center text-gray-500">
            No booking requests received yet.
          </div>
        ) : (
          (bookings || []).map((booking) => (
            <div key={booking._id} className="bg-gray-900 border border-gray-800 rounded-2xl p-6 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
              <div className="space-y-2 flex-1">
                <div className="flex items-center gap-3">
                  <h3 className="text-xl font-bold text-white">{booking.name}</h3>
                  <span className="bg-red-600/20 text-red-400 text-xs font-semibold px-3 py-1 rounded-full">
                    {booking.service}
                  </span>
                </div>

                <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-3 text-xs text-gray-400 pt-2">
                  <div className="flex items-center gap-2">
                    <Phone className="h-4 w-4 text-red-500" />
                    <span>{booking.phone}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Mail className="h-4 w-4 text-red-500" />
                    <span>{booking.email}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Car className="h-4 w-4 text-red-500" />
                    <span>{booking.vehicle || 'N/A'}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Clock className="h-4 w-4 text-red-500" />
                    <span>{booking.preferredDate} {booking.preferredTime}</span>
                  </div>
                </div>

                {booking.message && (
                  <p className="text-xs text-gray-400 bg-gray-800/40 p-3 rounded-lg mt-2">
                    Notes: {booking.message}
                  </p>
                )}
              </div>

              <div className="flex items-center gap-3 self-end md:self-center">
                <select
                  value={booking.status}
                  onChange={(e) => handleStatusChange(booking._id!, e.target.value)}
                  className="bg-gray-800 border border-gray-700 text-white text-sm font-semibold rounded-xl px-4 py-2.5 outline-none focus:border-red-500 cursor-pointer"
                >
                  <option value="pending">Pending</option>
                  <option value="confirmed">Confirmed</option>
                  <option value="completed">Completed</option>
                  <option value="cancelled">Cancelled</option>
                </select>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default BookingsPage;
