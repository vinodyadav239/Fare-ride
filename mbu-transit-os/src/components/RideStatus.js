import React from 'react';

const RideStatus = ({ ride }) => {
  if (!ride) {
    return React.createElement('p', {
      className: 'text-gray-500'
    }, 'No active rides');
  }

  return React.createElement('div', {
    className: 'p-4 bg-white rounded-xl shadow'
  }, [
    React.createElement('h3', {
      key: 'title',
      className: 'font-bold'
    }, 'Ride Status'),
    React.createElement('p', {
      key: 'id'
    }, `ID: ${ride.id}`),
    React.createElement('p', {
      key: 'status'
    }, `Status: ${ride.status}`),
    ride.driver && React.createElement('p', {
      key: 'driver'
    }, `Driver: ${ride.driver.name}`)
  ]);
};

export default RideStatus;