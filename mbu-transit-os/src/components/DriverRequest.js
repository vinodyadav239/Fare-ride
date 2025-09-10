import React from 'react';

const DriverRequest = ({ request, onAccept, onReject }) => {
  return React.createElement('div', {
    className: 'bg-white rounded-lg shadow-md p-4 mb-4'
  }, [
    React.createElement('h3', {
      key: 'title',
      className: 'text-lg font-semibold mb-2'
    }, 'Driver Request'),
    React.createElement('p', {
      key: 'info',
      className: 'text-gray-600 mb-4'
    }, 'New driver registration request'),
    React.createElement('div', {
      key: 'actions',
      className: 'flex gap-2'
    }, [
      React.createElement('button', {
        key: 'accept',
        onClick: () => onAccept(request.id),
        className: 'bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700'
      }, 'Accept'),
      React.createElement('button', {
        key: 'reject',
        onClick: () => onReject(request.id),
        className: 'bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700'
      }, 'Reject')
    ])
  ]);
};

export default DriverRequest;
