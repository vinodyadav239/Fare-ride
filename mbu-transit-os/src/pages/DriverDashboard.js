import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import BookingCard from '../components/BookingCard';
import socketManager from '../utils/socket';

const DriverDashboard = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [bookings, setBookings] = useState([]);

  useEffect(() => {
    const socket = socketManager.connect();
    const onNewRide = (ride) => {
      setBookings((prev) => [
        ...prev,
        {
          id: ride.id,
          studentName: ride.studentName || ride.studentId,
          studentId: ride.studentId,
          pickupLocation: ride.pickup?.name || 'Pickup',
          destination: ride.destination?.name || 'Destination',
          pickupZone: ride.pickup?.zone || 'city',
          destinationZone: ride.destination?.zone || 'city',
          date: ride.date || new Date().toISOString().split('T')[0],
          time: ride.time || '09:00',
          requestedTime: ride.requestedAt || new Date().toISOString(),
          status: 'pending',
          estimatedFare: ride.fare || 150,
          femaleSecurity: ride.femaleSecurity || false
        }
      ]);
    };
    socketManager.subscribeToNewRides(onNewRide);
    return () => {
      socketManager.removeListener('newRide', onNewRide);
    };
  }, []);

  const handleAccept = (id) => {
    setBookings(prev => prev.map(booking => 
      booking.id === id ? { ...booking, status: 'accepted' } : booking
    ));
    socketManager.emitRideAccept(id, user?.driverId || 'DRIVER_001');
  };

  const handleReject = (id) => {
    setBookings(prev => prev.map(booking => 
      booking.id === id ? { ...booking, status: 'rejected' } : booking
    ));
  };

  const handleCancel = (id) => {
    setBookings(prev => prev.map(booking => 
      booking.id === id ? { ...booking, status: 'cancelled' } : booking
    ));
  };

  return React.createElement('div', {
    className: 'min-h-screen bg-gradient-to-br from-green-50 via-blue-50 to-purple-50'
  }, [
    React.createElement('div', {
      key: 'header',
      className: 'bg-white/80 backdrop-blur-sm shadow-lg p-6 border-b border-white/20'
    }, [
      React.createElement('div', {
        key: 'header-content',
        className: 'flex justify-between items-center'
      }, [
        React.createElement('div', {
          key: 'header-left'
        }, [
          React.createElement('div', {
            key: 'title-section',
            className: 'flex items-center mb-2'
          }, [
            React.createElement('div', {
              key: 'icon',
              className: 'w-10 h-10 bg-gradient-to-r from-green-500 to-blue-500 rounded-full flex items-center justify-center mr-3'
            }, [
              React.createElement('span', {
                key: 'driver-icon',
                className: 'text-white text-lg'
              }, '🚖')
            ]),
            React.createElement('h1', {
              key: 'title',
              className: 'text-3xl font-bold bg-gradient-to-r from-green-600 to-blue-600 bg-clip-text text-transparent'
            }, 'Driver Dashboard')
          ]),
          React.createElement('p', {
            key: 'subtitle',
            className: 'text-gray-600 text-lg font-medium'
          }, `Welcome, ${user?.name || 'Driver'}! 👋`),
          React.createElement('div', {
            key: 'info-badges',
            className: 'flex flex-wrap gap-2'
          }, [
            React.createElement('span', {
              key: 'driver-id',
              className: 'text-sm text-gray-500 bg-gray-100 px-3 py-1 rounded-full'
            }, `ID: ${user?.driverId || 'N/A'}`),
            user?.vehicleNumber && React.createElement('span', {
              key: 'vehicle-number',
              className: 'text-sm text-gray-500 bg-blue-100 px-3 py-1 rounded-full'
            }, `🚗 ${user.vehicleNumber}`)
          ])
        ]),
        React.createElement('button', {
          key: 'logout-btn',
          onClick: () => {
            logout();
            navigate('/');
          },
          className: 'bg-gradient-to-r from-red-500 to-pink-500 text-white px-6 py-3 rounded-xl font-semibold hover:from-red-600 hover:to-pink-600 transition-all duration-300 transform hover:scale-102 hover:shadow-lg active:scale-98'
        }, [
          React.createElement('span', {
            key: 'logout-icon',
            className: 'mr-2'
          }, '🚪'),
          'Logout'
        ])
      ])
    ]),
    React.createElement('div', {
      key: 'content',
      className: 'p-6'
    }, [
        React.createElement('div', {
          key: 'bookings-section'
        }, [
          React.createElement('div', {
            key: 'bookings-header',
            className: 'flex justify-between items-center mb-4'
          }, [
            React.createElement('h2', {
              key: 'bookings-title',
              className: 'text-xl font-semibold'
            }, 'Incoming Ride Requests'),
            bookings.some(booking => booking.femaleSecurity) && React.createElement('div', {
              key: 'security-indicator',
              className: 'flex items-center bg-pink-100 text-pink-800 px-3 py-1 rounded-full text-sm font-medium'
            }, [
              React.createElement('span', {
                key: 'security-icon',
                className: 'mr-1'
              }, '👮‍♀️'),
              React.createElement('span', {
                key: 'security-text'
              }, 'Female Security Requests')
            ])
          ]),
        React.createElement('div', {
          key: 'bookings-list',
          className: 'space-y-4'
        }, bookings.map(booking => 
          React.createElement(BookingCard, {
            key: booking.id,
            booking: booking,
            onAccept: handleAccept,
            onReject: handleReject,
            onCancel: handleCancel
          })
        ))
      ])
    ])
  ]);
};

export default DriverDashboard;
