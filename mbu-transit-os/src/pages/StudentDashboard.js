import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import BookingCard from '../components/BookingCard';
import RideStatus from '../components/RideStatus';
import MapView from '../components/MapView';
import socketManager from '../utils/socket';

const StudentDashboard = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const presetPoints = {
    pickup: [
      { key: 'bus_stand', name: 'Tirupati Bus Stand', lat: 13.6455, lng: 79.4420, zone: 'city' },
      { key: 'tirupati_station', name: 'Tirupati Railway Station', lat: 13.6500, lng: 79.4500, zone: 'city' },
      { key: 'campus_gate', name: 'Mohan Babu University (Campus Gate)', lat: 13.6236179, lng: 79.2810435, zone: 'campus' },
      { key: 'library', name: 'MBU Library', lat: 13.6350, lng: 79.4255, zone: 'campus' },
      { key: 'hostel', name: 'MBU Hostel', lat: 13.6325, lng: 79.4180, zone: 'campus' },
      { key: 'canteen', name: 'MBU Canteen', lat: 13.6340, lng: 79.4200, zone: 'campus' },
      { key: 'sports_complex', name: 'MBU Sports Complex', lat: 13.6300, lng: 79.4150, zone: 'campus' },
      { key: 'temple', name: 'Tirumala Temple', lat: 13.6500, lng: 79.4200, zone: 'temple' },
      { key: 'airport', name: 'Tirupati Airport', lat: 13.6320, lng: 79.5430, zone: 'airport' },
      { key: 'mall', name: 'SV Shopping Mall', lat: 13.6400, lng: 79.4400, zone: 'city' },
      { key: 'hospital', name: 'SVIMS Hospital', lat: 13.6550, lng: 79.4300, zone: 'city' },
      { key: 'market', name: 'Tirupati Market', lat: 13.6480, lng: 79.4450, zone: 'city' },
      { key: 'park', name: 'Kalyani Park', lat: 13.6420, lng: 79.4350, zone: 'city' },
      { key: 'college', name: 'Sri Padmavati College', lat: 13.6600, lng: 79.4250, zone: 'city' }
    ],
    drop: [
      { key: 'mbu_campus', name: 'Mohan Babu University (Campus Gate)', lat: 13.6236179, lng: 79.2810435, zone: 'campus' },
      { key: 'tirupati_station', name: 'Tirupati Railway Station', lat: 13.6500, lng: 79.4500, zone: 'city' },
      { key: 'bus_stand', name: 'Tirupati Bus Stand', lat: 13.6455, lng: 79.4420, zone: 'city' },
      { key: 'airport', name: 'Tirupati Airport', lat: 13.6320, lng: 79.5430, zone: 'airport' },
      { key: 'temple', name: 'Tirumala Temple', lat: 13.6500, lng: 79.4200, zone: 'temple' },
      { key: 'mall', name: 'SV Shopping Mall', lat: 13.6400, lng: 79.4400, zone: 'city' },
      { key: 'hospital', name: 'SVIMS Hospital', lat: 13.6550, lng: 79.4300, zone: 'city' },
      { key: 'market', name: 'Tirupati Market', lat: 13.6480, lng: 79.4450, zone: 'city' },
      { key: 'park', name: 'Kalyani Park', lat: 13.6420, lng: 79.4350, zone: 'city' },
      { key: 'college', name: 'Sri Padmavati College', lat: 13.6600, lng: 79.4250, zone: 'city' },
      { key: 'library', name: 'MBU Library', lat: 13.6350, lng: 79.4255, zone: 'campus' },
      { key: 'hostel', name: 'MBU Hostel', lat: 13.6325, lng: 79.4180, zone: 'campus' },
      { key: 'canteen', name: 'MBU Canteen', lat: 13.6340, lng: 79.4200, zone: 'campus' },
      { key: 'sports_complex', name: 'MBU Sports Complex', lat: 13.6300, lng: 79.4150, zone: 'campus' }
    ]
  };

  // Fare calculation based on zones and distance
  const calculateFare = (pickupKey, dropKey) => {
    const pickup = getPointByKey('pickup', pickupKey);
    const drop = getPointByKey('drop', dropKey);
    
    if (!pickup || !drop) return 0;

    // Base fare
    let baseFare = 20;
    
    // Zone-based pricing
    const zoneMultipliers = {
      'campus': 1.0,
      'city': 1.2,
      'temple': 1.5,
      'airport': 2.0
    };
    
    const pickupMultiplier = zoneMultipliers[pickup.zone] || 1.0;
    const dropMultiplier = zoneMultipliers[drop.zone] || 1.0;
    
    // Calculate distance (simplified)
    const latDiff = Math.abs(drop.lat - pickup.lat);
    const lngDiff = Math.abs(drop.lng - pickup.lng);
    const distance = Math.sqrt(latDiff * latDiff + lngDiff * lngDiff) * 100; // Rough km calculation
    
    // Distance-based pricing
    let distanceFare = 0;
    if (distance < 5) {
      distanceFare = 15;
    } else if (distance < 10) {
      distanceFare = 25;
    } else if (distance < 20) {
      distanceFare = 40;
    } else {
      distanceFare = 60;
    }
    
    // Calculate final fare
    const zoneMultiplier = Math.max(pickupMultiplier, dropMultiplier);
    const totalFare = Math.round((baseFare + distanceFare) * zoneMultiplier);
    
    return totalFare;
  };

  const [ride, setRide] = useState(null);
  const [bookings, setBookings] = useState([]);

  const [selectedPickup, setSelectedPickup] = useState('bus_stand');
  const [selectedDrop, setSelectedDrop] = useState('mbu_campus');
  const [selectedDate, setSelectedDate] = useState('');
  const [selectedTime, setSelectedTime] = useState('');
  const [estimatedFare, setEstimatedFare] = useState(0);
  const [femaleSecurity, setFemaleSecurity] = useState(false);

  const getPointByKey = (group, key) => presetPoints[group].find(p => p.key === key);
  const firstDifferentKey = (list, notKey) => (list.find(p => p.key !== notKey) || list[0]).key;

  // Initialize date and time
  useEffect(() => {
    const today = new Date();
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);
    
    setSelectedDate(tomorrow.toISOString().split('T')[0]);
    setSelectedTime('09:00');
  }, []);

  // Update fare when pickup/drop changes
  useEffect(() => {
    const fare = calculateFare(selectedPickup, selectedDrop);
    setEstimatedFare(fare);
  }, [selectedPickup, selectedDrop]);

  useEffect(() => {
    const socket = socketManager.connect();
    const onStatus = (payload) => {
      // payload: { rideId, status, ... }
      setRide((prev) => {
        if (!prev) return prev;
        if (payload.rideId && payload.rideId !== prev.id) return prev;
        return { ...prev, status: payload.status };
      });
    };
    socketManager.subscribeToRideStatusChange(onStatus);
    return () => {
      socketManager.removeListener('rideStatusChange', onStatus);
    };
  }, []);

  const handlePickupChange = (value) => {
    setSelectedPickup(value);
    if (value === selectedDrop) {
      setSelectedDrop(firstDifferentKey(presetPoints.drop, value));
    }
  };

  const handleDropChange = (value) => {
    setSelectedDrop(value);
    if (value === selectedPickup) {
      setSelectedPickup(firstDifferentKey(presetPoints.pickup, value));
    }
  };

  const isSameLocation = selectedPickup === selectedDrop;

  const handleCreateRide = () => {
    if (isSameLocation || !selectedDate || !selectedTime) return;
    
    const p = getPointByKey('pickup', selectedPickup);
    const d = getPointByKey('drop', selectedDrop);
    const fare = calculateFare(selectedPickup, selectedDrop);
    
    const newRide = {
      id: `r_${Date.now()}`,
      status: 'pending',
      pickup: { name: p.name, lat: p.lat, lng: p.lng, zone: p.zone },
      destination: { name: d.name, lat: d.lat, lng: d.lng, zone: d.zone },
      studentId: user?.studentId || 'STU001',
      studentName: user?.name || 'Student',
      date: selectedDate,
      time: selectedTime,
      fare: fare,
      femaleSecurity: femaleSecurity,
      requestedAt: new Date().toISOString()
    };
    
    setRide(newRide);
    // Emit ride request to drivers
    socketManager.emitRideRequest(newRide);
  };

  const handleAccept = (id) => {
    setBookings(prev => prev.map(booking => 
      booking.id === id ? { ...booking, status: 'accepted' } : booking
    ));
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
    className: 'min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50'
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
              className: 'w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center mr-3'
            }, [
              React.createElement('span', {
                key: 'student-icon',
                className: 'text-white text-lg'
              }, '🎓')
            ]),
            React.createElement('h1', {
              key: 'title',
              className: 'text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent'
            }, 'Student Dashboard')
          ]),
          React.createElement('p', {
            key: 'subtitle',
            className: 'text-gray-600 text-lg font-medium'
          }, `Welcome back, ${user?.name || 'Student'}! 👋`),
          React.createElement('p', {
            key: 'student-id',
            className: 'text-sm text-gray-500 bg-gray-100 px-3 py-1 rounded-full inline-block'
          }, `ID: ${user?.studentId || 'N/A'}`)
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
      className: 'p-6 grid md:grid-cols-3 gap-6'
    }, [
      React.createElement('div', {
        key: 'sidebar',
        className: 'col-span-1 space-y-6'
      }, [
        React.createElement('div', {
          key: 'booking-section',
          className: 'bg-white/90 backdrop-blur-sm rounded-2xl shadow-xl p-6 space-y-6 border border-white/20 hover:shadow-2xl transition-all duration-300'
        }, [
          React.createElement('div', {
            key: 'booking-header',
            className: 'flex items-center mb-4'
          }, [
            React.createElement('div', {
              key: 'booking-icon',
              className: 'w-8 h-8 bg-gradient-to-r from-green-500 to-blue-500 rounded-full flex items-center justify-center mr-3'
            }, [
              React.createElement('span', {
                key: 'ride-icon',
                className: 'text-white text-sm'
              }, '🚗')
            ]),
            React.createElement('h2', {
              key: 'booking-title',
              className: 'text-xl font-bold text-gray-800'
            }, 'Create a Ride')
          ]),
          
          React.createElement('div', { key: 'date-time-row', className: 'grid grid-cols-2 gap-3' }, [
            React.createElement('div', { key: 'date-field' }, [
              React.createElement('label', { key: 'date-label', className: 'block text-sm text-gray-700 mb-1' }, 'Date'),
              React.createElement('input', {
                key: 'date-input',
                type: 'date',
                value: selectedDate,
                onChange: (e) => setSelectedDate(e.target.value),
                min: new Date().toISOString().split('T')[0],
                className: 'w-full p-2 border rounded'
              })
            ]),
            React.createElement('div', { key: 'time-field' }, [
              React.createElement('label', { key: 'time-label', className: 'block text-sm text-gray-700 mb-1' }, 'Time'),
              React.createElement('input', {
                key: 'time-input',
                type: 'time',
                value: selectedTime,
                onChange: (e) => setSelectedTime(e.target.value),
                className: 'w-full p-2 border rounded'
              })
            ])
          ]),

          React.createElement('div', { key: 'pickup-field' }, [
            React.createElement('label', { key: 'pickup-label', className: 'block text-sm text-gray-700 mb-1' }, 'Pickup Location'),
            React.createElement('select', {
              key: 'pickup-select',
              value: selectedPickup,
              onChange: (e) => handlePickupChange(e.target.value),
              className: 'w-full p-2 border rounded'
            }, presetPoints.pickup.map(p => React.createElement('option', { key: p.key, value: p.key }, `${p.name} (${p.zone})`)))
          ]),
          
          React.createElement('div', { key: 'drop-field' }, [
            React.createElement('label', { key: 'drop-label', className: 'block text-sm text-gray-700 mb-1' }, 'Destination'),
            React.createElement('select', {
              key: 'drop-select',
              value: selectedDrop,
              onChange: (e) => handleDropChange(e.target.value),
              className: 'w-full p-2 border rounded'
            }, presetPoints.drop.map(p => React.createElement('option', { key: p.key, value: p.key }, `${p.name} (${p.zone})`)))
          ]),

          React.createElement('div', {
            key: 'fare-display',
            className: 'bg-blue-50 p-3 rounded border border-blue-200'
          }, [
            React.createElement('div', {
              key: 'fare-title',
              className: 'text-sm font-medium text-blue-800 mb-1'
            }, 'Estimated Fare'),
            React.createElement('div', {
              key: 'fare-amount',
              className: 'text-2xl font-bold text-blue-900'
            }, `₹${estimatedFare}`),
            React.createElement('div', {
              key: 'fare-note',
              className: 'text-xs text-blue-600'
            }, 'Based on distance and zone pricing')
          ]),

          React.createElement('div', {
            key: 'security-option',
            className: 'bg-pink-50 p-3 rounded border border-pink-200'
          }, [
            React.createElement('div', {
              key: 'security-checkbox',
              className: 'flex items-center'
            }, [
              React.createElement('input', {
                key: 'security-input',
                type: 'checkbox',
                id: 'femaleSecurity',
                checked: femaleSecurity,
                onChange: (e) => setFemaleSecurity(e.target.checked),
                className: 'h-4 w-4 text-pink-600 focus:ring-pink-500 border-gray-300 rounded'
              }),
              React.createElement('label', {
                key: 'security-label',
                htmlFor: 'femaleSecurity',
                className: 'ml-2 text-sm font-medium text-pink-800'
              }, 'Request Female Security'),
              React.createElement('span', {
                key: 'security-icon',
                className: 'ml-2 text-pink-600'
              }, '👮‍♀️')
            ]),
            React.createElement('p', {
              key: 'security-note',
              className: 'text-xs text-pink-600 mt-1'
            }, 'Prefer a female security guard for additional safety')
          ]),

          isSameLocation && React.createElement('div', {
            key: 'same-warning',
            className: 'text-sm text-red-600'
          }, 'Pickup and destination cannot be the same.'),
          
          (!selectedDate || !selectedTime) && React.createElement('div', {
            key: 'datetime-warning',
            className: 'text-sm text-red-600'
          }, 'Please select both date and time.'),
          
          React.createElement('button', {
            key: 'create-ride',
            onClick: handleCreateRide,
            disabled: isSameLocation || !selectedDate || !selectedTime,
            className: `w-full text-white py-4 rounded-xl font-semibold text-lg transition-all duration-300 transform ${
              (isSameLocation || !selectedDate || !selectedTime) 
                ? 'bg-gray-400 cursor-not-allowed scale-98' 
                : 'bg-gradient-to-r from-green-500 to-blue-500 hover:from-green-600 hover:to-blue-600 hover:scale-102 hover:shadow-xl active:scale-98'
            }`
          }, [
            React.createElement('span', {
              key: 'button-icon',
              className: 'mr-2 text-xl'
            }, '🚀'),
            'Request Driver'
          ])
        ]),
        React.createElement('div', {
          key: 'bookings-list'
        }, bookings.map(booking => 
          React.createElement(BookingCard, {
            key: booking.id,
            booking: booking,
            onAccept: handleAccept,
            onReject: handleReject,
            onCancel: handleCancel
          })
        )),
        React.createElement(RideStatus, {
          key: 'ride-status',
          ride: ride
        })
      ]),
      React.createElement('div', {
        key: 'map-section',
        className: 'col-span-2'
      }, [
        React.createElement(MapView, {
          key: 'map-view',
          ride: ride
        })
      ])
    ])
  ]);
};

export default StudentDashboard;
