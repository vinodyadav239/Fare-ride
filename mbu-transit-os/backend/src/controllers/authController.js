// Sample user database
const users = [
	{
		id: 'stu_001',
		email: 'student@mbu.edu',
		password: 'student123',
		name: 'Ravi Kumar',
		userType: 'student',
		studentId: 'STU001',
		phone: '+91 9876543210'
	},
	{
		id: 'stu_002',
		email: 'priya@mbu.edu',
		password: 'student123',
		name: 'Priya Sharma',
		userType: 'student',
		studentId: 'STU002',
		phone: '+91 9876543211'
	},
	{
		id: 'drv_001',
		email: 'raju@mbu.edu',
		password: 'driver123',
		name: 'Raju Kumar',
		userType: 'driver',
		driverId: 'DRV001',
		phone: '+91 9876543212',
		vehicleNumber: 'AP03 AB 1234',
		licenseNumber: 'DL123456789'
	},
	{
		id: 'drv_002',
		email: 'suresh@mbu.edu',
		password: 'driver123',
		name: 'Suresh Reddy',
		userType: 'driver',
		driverId: 'DRV002',
		phone: '+91 9876543213',
		vehicleNumber: 'AP03 CD 5678',
		licenseNumber: 'DL987654321'
	},
	{
		id: 'adm_001',
		email: 'admin@mbu.edu',
		password: 'admin123',
		name: 'Admin User',
		userType: 'admin',
		adminId: 'ADM001',
		phone: '+91 9876543214'
	}
];

export const login = (req, res) => {
	const { email, password, userType } = req.body || {};
	
	if (!email || !password) {
		return res.status(400).json({ 
			success: false,
			error: 'Email and password are required' 
		});
	}

	// Find user by email and password
	const user = users.find(u => 
		u.email === email && 
		u.password === password && 
		(!userType || u.userType === userType)
	);

	if (!user) {
		return res.status(401).json({ 
			success: false,
			error: 'Invalid credentials or user type mismatch' 
		});
	}

	// Remove password from response
	const { password: _, ...userWithoutPassword } = user;

	return res.json({
		success: true,
		user: userWithoutPassword,
		token: `jwt-${user.id}-${Date.now()}`
	});
};

export const register = (req, res) => {
	const { email, password, name, userType, phone, studentId, driverId, vehicleNumber, licenseNumber } = req.body || {};
	
	if (!email || !password || !name || !userType) {
		return res.status(400).json({ 
			success: false,
			error: 'Email, password, name, and user type are required' 
		});
	}

	// Check if user already exists
	const existingUser = users.find(u => u.email === email);
	if (existingUser) {
		return res.status(409).json({ 
			success: false,
			error: 'User with this email already exists' 
		});
	}

	// Generate new user ID
	const newId = userType === 'student' ? `stu_${String(users.filter(u => u.userType === 'student').length + 1).padStart(3, '0')}` :
				  userType === 'driver' ? `drv_${String(users.filter(u => u.userType === 'driver').length + 1).padStart(3, '0')}` :
				  `adm_${String(users.filter(u => u.userType === 'admin').length + 1).padStart(3, '0')}`;

	const newUser = {
		id: newId,
		email,
		password,
		name,
		userType,
		phone: phone || '',
		...(userType === 'student' && { studentId: studentId || `STU${String(users.filter(u => u.userType === 'student').length + 1).padStart(3, '0')}` }),
		...(userType === 'driver' && { 
			driverId: driverId || `DRV${String(users.filter(u => u.userType === 'driver').length + 1).padStart(3, '0')}`,
			vehicleNumber: vehicleNumber || '',
			licenseNumber: licenseNumber || ''
		}),
		...(userType === 'admin' && { adminId: `ADM${String(users.filter(u => u.userType === 'admin').length + 1).padStart(3, '0')}` })
	};

	users.push(newUser);

	// Remove password from response
	const { password: _, ...userWithoutPassword } = newUser;

	return res.status(201).json({
		success: true,
		user: userWithoutPassword,
		token: `jwt-${newUser.id}-${Date.now()}`
	});
};

export const getUsers = (req, res) => {
	const usersWithoutPasswords = users.map(({ password, ...user }) => user);
	return res.json({
		success: true,
		users: usersWithoutPasswords
	});
};
