import express from 'express';
import http from 'http';
import cors from 'cors';
import dotenv from 'dotenv';
import { Server as SocketIOServer } from 'socket.io';
import authRoutes from './routes/auth.js';
import ridesRoutes from './routes/rides.js';
import adminRoutes from './routes/admin.js';

dotenv.config();

const app = express();
const server = http.createServer(app);
const io = new SocketIOServer(server, {
	cors: {
		origin: '*',
		methods: ['GET', 'POST']
	}
});

// Middleware
app.use(cors());
app.use(express.json());

// Healthcheck
app.get('/health', (_req, res) => {
	res.json({ ok: true });
});

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/rides', ridesRoutes);
app.use('/api/admin', adminRoutes);

// Socket.IO events
io.on('connection', (socket) => {
	console.log('Client connected', socket.id);

	socket.on('rideRequest', (data) => {
		io.emit('newRide', data);
	});

	socket.on('driverLocation', (location) => {
		io.emit('driverLocation', location);
	});

	socket.on('rideAccept', (payload) => {
		io.emit('rideStatusChange', { ...payload, status: 'accepted' });
	});

	socket.on('rideComplete', ({ rideId }) => {
		io.emit('rideStatusChange', { rideId, status: 'completed' });
	});

	socket.on('disconnect', () => {
		console.log('Client disconnected', socket.id);
	});
});

const PORT = process.env.PORT || 3001;
server.listen(PORT, () => {
	console.log(`API server listening on http://localhost:${PORT}`);
});
