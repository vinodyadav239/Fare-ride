import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.js';
import './styles/animations.css';
import './styles/components.css';
import './styles/booking-card.css';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(React.createElement(React.StrictMode, null, [
  React.createElement(App, { key: 'app' })
]));