import React from 'react';

const Navbar = ({ user, onLogout }) => {
  return React.createElement('nav', {
    className: 'bg-blue-600 text-white p-4 shadow-lg'
  }, [
    React.createElement('div', {
      key: 'container',
      className: 'container mx-auto flex justify-between items-center'
    }, [
      React.createElement('h1', {
        key: 'logo',
        className: 'text-xl font-bold'
      }, 'MBU Transit OS'),
      React.createElement('div', {
        key: 'user-info',
        className: 'flex items-center gap-4'
      }, [
        React.createElement('span', {
          key: 'welcome'
        }, `Welcome, ${user?.name || 'User'}`),
        React.createElement('button', {
          key: 'logout',
          onClick: onLogout,
          className: 'bg-red-600 hover:bg-red-700 px-4 py-2 rounded transition-colors'
        }, 'Logout')
      ])
    ])
  ]);
};

export default Navbar;
