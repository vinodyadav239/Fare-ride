import React from 'react';

const BookingCard = ({ booking, onAccept, onReject, onCancel }) => {
  const {
    id,
    studentName,
    studentId,
    pickupLocation,
    destination,
    pickupZone,
    destinationZone,
    date,
    time,
    requestedTime,
    status,
    estimatedFare,
    femaleSecurity
  } = booking;

  const getStatusColor = (status) => {
    switch (status) {
      case 'pending': return 'status-pending';
      case 'accepted': return 'status-accepted';
      case 'in-progress': return 'status-in-progress';
      case 'completed': return 'status-completed';
      case 'cancelled': return 'status-cancelled';
      default: return 'status-default';
    }
  };

  return React.createElement('div', {
    className: 'booking-card'
  }, [
    React.createElement('div', {
      key: 'header',
      className: 'booking-header'
    }, [
      React.createElement('div', { key: 'student-info', className: 'student-info' }, [
        React.createElement('h3', {
          key: 'name',
          className: 'student-name'
        }, studentName),
        React.createElement('p', {
          key: 'id',
          className: 'student-id'
        }, `ID: ${studentId}`)
      ]),
      React.createElement('span', {
        key: 'status',
        className: `status-badge ${getStatusColor(status)}`
      }, [
        React.createElement('span', {
          key: 'status-icon',
          className: 'status-icon'
        }, status === 'pending' ? '⏳' : status === 'accepted' ? '✅' : status === 'cancelled' ? '❌' : '🔄'),
        status.toUpperCase()
      ])
    ]),
    React.createElement('div', {
      key: 'locations',
      className: 'locations-section'
    }, [
      React.createElement('div', {
        key: 'pickup',
        className: 'location-item'
      }, [
        React.createElement('div', {
          key: 'pickup-dot',
          className: 'location-dot pickup-dot'
        }),
        React.createElement('div', { key: 'pickup-info', className: 'location-info' }, [
          React.createElement('p', {
            key: 'pickup-label',
            className: 'location-label'
          }, 'Pickup'),
          React.createElement('p', {
            key: 'pickup-location',
            className: 'location-name'
          }, pickupLocation),
          pickupZone && React.createElement('span', {
            key: 'pickup-zone',
            className: 'zone-badge pickup-zone'
          }, pickupZone)
        ])
      ]),
      React.createElement('div', {
        key: 'destination',
        className: 'location-item'
      }, [
        React.createElement('div', {
          key: 'dest-dot',
          className: 'location-dot destination-dot'
        }),
        React.createElement('div', { key: 'dest-info', className: 'location-info' }, [
          React.createElement('p', {
            key: 'dest-label',
            className: 'location-label'
          }, 'Destination'),
          React.createElement('p', {
            key: 'dest-location',
            className: 'location-name'
          }, destination),
          destinationZone && React.createElement('span', {
            key: 'dest-zone',
            className: 'zone-badge destination-zone'
          }, destinationZone)
        ])
      ])
    ]),
    React.createElement('div', {
      key: 'details',
      className: 'details-section'
    }, [
      React.createElement('div', {
        key: 'datetime-row',
        className: 'datetime-row'
      }, [
        React.createElement('div', { key: 'date', className: 'detail-item' }, [
          React.createElement('p', {
            key: 'date-label',
            className: 'detail-label'
          }, 'Ride Date'),
          React.createElement('p', {
            key: 'date-value',
            className: 'detail-value'
          }, date ? new Date(date).toLocaleDateString() : 'N/A')
        ]),
        React.createElement('div', { key: 'time', className: 'detail-item' }, [
          React.createElement('p', {
            key: 'time-label',
            className: 'detail-label'
          }, 'Ride Time'),
          React.createElement('p', {
            key: 'time-value',
            className: 'detail-value'
          }, time || 'N/A')
        ])
      ]),
      React.createElement('div', {
        key: 'request-time',
        className: 'request-time'
      }, [
        React.createElement('p', {
          key: 'request-label',
          className: 'detail-label'
        }, 'Requested At'),
        React.createElement('p', {
          key: 'request-value',
          className: 'detail-value'
        }, new Date(requestedTime).toLocaleString())
      ]),
      React.createElement('div', {
        key: 'fare',
        className: 'fare-section'
      }, [
        React.createElement('p', {
          key: 'fare-label',
          className: 'fare-label'
        }, 'Estimated Fare'),
        React.createElement('p', {
          key: 'fare-value',
          className: 'fare-value'
        }, `₹${estimatedFare}`)
      ]),

      femaleSecurity && React.createElement('div', {
        key: 'security-preference',
        className: 'bg-pink-50 p-3 rounded border border-pink-200 text-center'
      }, [
        React.createElement('div', {
          key: 'security-icon',
          className: 'text-2xl mb-1'
        }, '👮‍♀️'),
        React.createElement('p', {
          key: 'security-text',
          className: 'text-sm font-medium text-pink-800'
        }, 'Female Security Requested'),
        React.createElement('p', {
          key: 'security-note',
          className: 'text-xs text-pink-600'
        }, 'Student prefers female security guard')
      ])
    ]),
      React.createElement('div', {
        key: 'actions',
        className: 'actions-section'
      }, [
        status === 'pending' && React.createElement('button', {
          key: 'accept',
          onClick: () => onAccept(id),
          className: 'action-button accept-button'
        }, [
          React.createElement('span', {
            key: 'accept-icon',
            className: 'button-icon'
          }, '✅'),
          'Accept'
        ]),
        status === 'pending' && React.createElement('button', {
          key: 'reject',
          onClick: () => onReject(id),
          className: 'action-button reject-button'
        }, [
          React.createElement('span', {
            key: 'reject-icon',
            className: 'button-icon'
          }, '❌'),
          'Reject'
        ]),
        (status === 'accepted' || status === 'pending') && React.createElement('button', {
          key: 'cancel',
          onClick: () => onCancel(id),
          className: 'action-button cancel-button'
        }, [
          React.createElement('span', {
            key: 'cancel-icon',
            className: 'button-icon'
          }, '🚫'),
          'Cancel'
        ])
      ].filter(Boolean))
  ]);
};

export default BookingCard;