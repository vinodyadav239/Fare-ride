// Redux store configuration for MBU Transit OS

import { createStore, combineReducers, applyMiddleware } from 'redux';
import { thunk } from 'redux-thunk';

// Initial states
const initialAuthState = {
  user: null,
  isAuthenticated: false,
  userType: null,
  loading: false,
  error: null
};

const initialRideState = {
  currentRide: null,
  rides: [],
  availableRides: [],
  loading: false,
  error: null
};

const initialDriverState = {
  drivers: [],
  driverRequests: [],
  loading: false,
  error: null
};

// Auth reducer
const authReducer = (state = initialAuthState, action) => {
  switch (action.type) {
    case 'LOGIN_START':
      return { ...state, loading: true, error: null };
    case 'LOGIN_SUCCESS':
      return {
        ...state,
        loading: false,
        isAuthenticated: true,
        user: action.payload.user,
        userType: action.payload.userType,
        error: null
      };
    case 'LOGIN_FAILURE':
      return {
        ...state,
        loading: false,
        isAuthenticated: false,
        user: null,
        userType: null,
        error: action.payload
      };
    case 'LOGOUT':
      return {
        ...state,
        isAuthenticated: false,
        user: null,
        userType: null,
        error: null
      };
    default:
      return state;
  }
};

// Ride reducer
const rideReducer = (state = initialRideState, action) => {
  switch (action.type) {
    case 'FETCH_RIDES_START':
      return { ...state, loading: true, error: null };
    case 'FETCH_RIDES_SUCCESS':
      return { ...state, loading: false, rides: action.payload };
    case 'FETCH_RIDES_FAILURE':
      return { ...state, loading: false, error: action.payload };
    case 'BOOK_RIDE_SUCCESS':
      return { ...state, currentRide: action.payload };
    case 'UPDATE_RIDE_STATUS':
      return {
        ...state,
        rides: state.rides.map(ride =>
          ride.id === action.payload.rideId
            ? { ...ride, status: action.payload.status }
            : ride
        )
      };
    case 'CLEAR_CURRENT_RIDE':
      return { ...state, currentRide: null };
    default:
      return state;
  }
};

// Driver reducer
const driverReducer = (state = initialDriverState, action) => {
  switch (action.type) {
    case 'FETCH_DRIVERS_START':
      return { ...state, loading: true, error: null };
    case 'FETCH_DRIVERS_SUCCESS':
      return { ...state, loading: false, drivers: action.payload };
    case 'FETCH_DRIVERS_FAILURE':
      return { ...state, loading: false, error: action.payload };
    case 'FETCH_DRIVER_REQUESTS_SUCCESS':
      return { ...state, driverRequests: action.payload };
    case 'APPROVE_DRIVER_SUCCESS':
      return {
        ...state,
        driverRequests: state.driverRequests.filter(req => req.id !== action.payload)
      };
    case 'REJECT_DRIVER_SUCCESS':
      return {
        ...state,
        driverRequests: state.driverRequests.filter(req => req.id !== action.payload)
      };
    default:
      return state;
  }
};

// Root reducer
const rootReducer = combineReducers({
  auth: authReducer,
  rides: rideReducer,
  drivers: driverReducer
});

// Create store
const store = createStore(rootReducer, applyMiddleware(thunk));

export default store;
