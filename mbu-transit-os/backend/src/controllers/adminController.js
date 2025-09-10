const driverRequests = [
	{ id: 'dreq_1', name: 'Raju Kumar', status: 'pending' },
	{ id: 'dreq_2', name: 'Suresh Reddy', status: 'pending' }
];

const rides = [];

export const getAllRides = (_req, res) => {
	return res.json(rides);
};

export const getDriverRequests = (_req, res) => {
	return res.json(driverRequests);
};

export const approveDriver = (req, res) => {
	const { requestId } = req.params;
	const idx = driverRequests.findIndex(r => r.id === requestId);
	if (idx === -1) return res.status(404).json({ error: 'Request not found' });
	driverRequests[idx].status = 'approved';
	return res.json(driverRequests[idx]);
};

export const rejectDriver = (req, res) => {
	const { requestId } = req.params;
	const idx = driverRequests.findIndex(r => r.id === requestId);
	if (idx === -1) return res.status(404).json({ error: 'Request not found' });
	driverRequests[idx].status = 'rejected';
	return res.json(driverRequests[idx]);
};

export const getSystemStats = (_req, res) => {
	return res.json({
		totalDrivers: 25,
		activeRides: 12,
		totalStudents: 150,
		totalRevenue: 25000
	});
};
