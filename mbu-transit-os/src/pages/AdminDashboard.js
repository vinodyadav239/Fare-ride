import React, { useState } from 'react';
import DriverRequest from '../components/DriverRequest';

const AdminDashboard = () => {
  const [driverRequests, setDriverRequests] = useState([
    {
      id: 1,
      name: 'Raju Kumar',
      email: 'raju@example.com',
      phone: '9876543210',
      licenseNumber: 'DL123456789',
      status: 'pending'
    },
    {
      id: 2,
      name: 'Suresh Reddy',
      email: 'suresh@example.com',
      phone: '9876543211',
      licenseNumber: 'DL987654321',
      status: 'pending'
    }
  ]);

  const [stats, setStats] = useState({
    totalDrivers: 25,
    activeRides: 12,
    totalStudents: 150,
    totalRevenue: 25000
  });

  const handleAcceptDriver = (id) => {
    setDriverRequests(prev => prev.map(request => 
      request.id === id ? { ...request, status: 'accepted' } : request
    ));
  };

  const handleRejectDriver = (id) => {
    setDriverRequests(prev => prev.map(request => 
      request.id === id ? { ...request, status: 'rejected' } : request
    ));
  };

  return React.createElement('div', {
    className: 'min-h-screen bg-gray-100'
  }, [
    React.createElement('div', {
      key: 'header',
      className: 'bg-white shadow-sm p-4'
    }, [
      React.createElement('h1', {
        key: 'title',
        className: 'text-2xl font-bold text-gray-800'
      }, 'Admin Dashboard'),
      React.createElement('p', {
        key: 'subtitle',
        className: 'text-gray-600'
      }, 'Manage the transit system')
    ]),
    React.createElement('div', {
      key: 'content',
      className: 'p-6'
    }, [
      React.createElement('div', {
        key: 'stats',
        className: 'grid grid-cols-1 md:grid-cols-4 gap-4 mb-6'
      }, [
        React.createElement('div', {
          key: 'total-drivers',
          className: 'bg-white p-4 rounded-lg shadow-md'
        }, [
          React.createElement('h3', {
            key: 'drivers-title',
            className: 'text-lg font-semibold text-gray-700'
          }, 'Total Drivers'),
          React.createElement('p', {
            key: 'drivers-value',
            className: 'text-2xl font-bold text-blue-600'
          }, stats.totalDrivers)
        ]),
        React.createElement('div', {
          key: 'active-rides',
          className: 'bg-white p-4 rounded-lg shadow-md'
        }, [
          React.createElement('h3', {
            key: 'rides-title',
            className: 'text-lg font-semibold text-gray-700'
          }, 'Active Rides'),
          React.createElement('p', {
            key: 'rides-value',
            className: 'text-2xl font-bold text-green-600'
          }, stats.activeRides)
        ]),
        React.createElement('div', {
          key: 'total-students',
          className: 'bg-white p-4 rounded-lg shadow-md'
        }, [
          React.createElement('h3', {
            key: 'students-title',
            className: 'text-lg font-semibold text-gray-700'
          }, 'Total Students'),
          React.createElement('p', {
            key: 'students-value',
            className: 'text-2xl font-bold text-purple-600'
          }, stats.totalStudents)
        ]),
        React.createElement('div', {
          key: 'total-revenue',
          className: 'bg-white p-4 rounded-lg shadow-md'
        }, [
          React.createElement('h3', {
            key: 'revenue-title',
            className: 'text-lg font-semibold text-gray-700'
          }, 'Total Revenue'),
          React.createElement('p', {
            key: 'revenue-value',
            className: 'text-2xl font-bold text-yellow-600'
          }, `₹${stats.totalRevenue}`)
        ])
      ]),
      React.createElement('div', {
        key: 'driver-requests-section'
      }, [
        React.createElement('h2', {
          key: 'requests-title',
          className: 'text-xl font-semibold mb-4'
        }, 'Driver Registration Requests'),
        React.createElement('div', {
          key: 'requests-list',
          className: 'space-y-4'
        }, driverRequests.map(request => 
          React.createElement(DriverRequest, {
            key: request.id,
            request: request,
            onAccept: handleAcceptDriver,
            onReject: handleRejectDriver
          })
        ))
      ])
    ])
  ]);
};

export default AdminDashboard;
