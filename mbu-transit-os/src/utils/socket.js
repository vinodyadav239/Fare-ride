// Socket.io client for real-time communication

import { io } from 'socket.io-client';

class SocketManager {
  constructor() {
    this.socket = null;
    this.isConnected = false;
  }

  connect() {
    if (!this.socket) {
      this.socket = io('http://localhost:3001', {
        transports: ['websocket', 'polling']
      });

      this.socket.on('connect', () => {
        console.log('Connected to server');
        this.isConnected = true;
      });

      this.socket.on('disconnect', () => {
        console.log('Disconnected from server');
        this.isConnected = false;
      });

      this.socket.on('connect_error', (error) => {
        console.error('Connection error:', error);
        this.isConnected = false;
      });
    }
    return this.socket;
  }

  disconnect() {
    if (this.socket) {
      this.socket.disconnect();
      this.socket = null;
      this.isConnected = false;
    }
  }

  // Ride-related events
  subscribeToRideUpdates(callback) {
    if (this.socket) {
      this.socket.on('rideUpdate', callback);
    }
  }

  subscribeToNewRides(callback) {
    if (this.socket) {
      this.socket.on('newRide', callback);
    }
  }

  subscribeToRideStatusChange(callback) {
    if (this.socket) {
      this.socket.on('rideStatusChange', callback);
    }
  }

  // Driver location updates
  subscribeToDriverLocation(callback) {
    if (this.socket) {
      this.socket.on('driverLocation', callback);
    }
  }

  // Admin notifications
  subscribeToAdminNotifications(callback) {
    if (this.socket) {
      this.socket.on('adminNotification', callback);
    }
  }

  // Emit events
  emitRideRequest(rideData) {
    if (this.socket) {
      this.socket.emit('rideRequest', rideData);
    }
  }

  emitDriverLocation(location) {
    if (this.socket) {
      this.socket.emit('driverLocation', location);
    }
  }

  emitRideAccept(rideId, driverId) {
    if (this.socket) {
      this.socket.emit('rideAccept', { rideId, driverId });
    }
  }

  emitRideComplete(rideId) {
    if (this.socket) {
      this.socket.emit('rideComplete', { rideId });
    }
  }

  // Cleanup
  removeAllListeners() {
    if (this.socket) {
      this.socket.removeAllListeners();
    }
  }

  removeListener(event, callback) {
    if (this.socket) {
      this.socket.off(event, callback);
    }
  }
}

// Create singleton instance
const socketManager = new SocketManager();

export default socketManager;
