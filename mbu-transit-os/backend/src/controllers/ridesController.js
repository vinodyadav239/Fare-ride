const rides = [];

export const bookRide = (req, res) => {
	const ride = {
		id: `r_${Date.now()}`,
		...req.body,
		status: 'pending',
		createdAt: new Date().toISOString()
	};
	rides.push(ride);
	return res.status(201).json(ride);
};

export const getStudentRides = (req, res) => {
	const { studentId } = req.params;
	return res.json(rides.filter(r => r.studentId === studentId));
};

export const acceptRide = (req, res) => {
	const { rideId } = req.params;
	const { driverId } = req.body || {};
	const ride = rides.find(r => r.id === rideId);
	if (!ride) return res.status(404).json({ error: 'Ride not found' });
	ride.status = 'accepted';
	ride.driverId = driverId;
	return res.json(ride);
};

export const updateRideStatus = (req, res) => {
	const { rideId } = req.params;
	const { status } = req.body || {};
	const ride = rides.find(r => r.id === rideId);
	if (!ride) return res.status(404).json({ error: 'Ride not found' });
	ride.status = status || ride.status;
	return res.json(ride);
};
